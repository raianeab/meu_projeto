const { processUploadFile, convertTypes } = require('../services/dataService');
const { supabase } = require('../config/db');

const BATCH_SIZE = 100;

const dataController = {

  index(req, res) {
    const error   = req.flash('error')[0]   || null;
    const success = req.flash('success')[0] || null;
    res.render('pages/inserir-dados', { error, success });
  },

  async upload(req, res) {
    try {

      if (!req.file)
        return flashAndRedirect(req, res, 'error', 'Nenhum arquivo enviado.');

      const user = req.session.user;
      if (!user?.company_id)
        return flashAndRedirect(req, res, 'error', 'Usuário não autenticado.');

      const filePath = req.file.path;
      const ext = req.file.originalname.split('.').pop().toLowerCase();

      // 🔹 Service já ignora as 2 primeiras linhas
      const { data } = await processUploadFile(filePath, ext);

      if (!data?.length)
        return flashAndRedirect(req, res, 'error', 'Arquivo vazio ou inválido.');

      const registros = data
        .map(r => {
          // Aplica conversão de tipos (datas, números, etc)
          const converted = convertTypes(r);
          return {
            ...converted,
            company_id: user.company_id
          };
        })
        .filter(r => r.EmployeeID);

      if (!registros.length)
        return flashAndRedirect(req, res, 'error', 'Nenhum EmployeeID válido encontrado.');

      let processed = 0;
      let errors = 0;

      for (let i = 0; i < registros.length; i += BATCH_SIZE) {
        const batch = registros.slice(i, i + BATCH_SIZE);

        const { error } = await supabase
          .from('dados')
          .upsert(batch, { onConflict: 'company_id,EmployeeID' });

        if (error) {
          console.error('Erro no batch:', error.message);
          errors += batch.length;
        } else {
          processed += batch.length;
        }
      }

      const message =
        errors > 0
          ? `${processed} registros inseridos/atualizados com ${errors} erro(s).`
          : `${processed} registros processados com sucesso.`;

      return flashAndRedirect(req, res, errors ? 'error' : 'success', message);

    } catch (err) {
      console.error(err);
      return flashAndRedirect(req, res, 'error', err.message);
    }
  }
};

function flashAndRedirect(req, res, type, message) {
  req.flash(type, message);
  return res.redirect('/dados');
}

module.exports = dataController;
