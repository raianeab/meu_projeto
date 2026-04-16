const leadsService = require('../services/leadsService');

const leadsController = {

  async create(req, res) {
    try {
      const { nome, nome_empresa, email } = req.body;

      if (!nome || !nome_empresa || !email) {
        return res.status(400).json({ error: 'Preencha todos os campos.' });
      }

      // Validação básica de e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
      }

      await leadsService.register({
        nome:        nome.trim().slice(0, 150),
        nome_empresa: nome_empresa.trim().slice(0, 150),
        email:       email.trim().toLowerCase().slice(0, 254),
      });

      return res.status(201).json({ ok: true });

    } catch (err) {
      console.error('[leadsController.create]', err.message);
      return res.status(500).json({ error: 'Erro interno. Tente novamente mais tarde.' });
    }
  },

};

module.exports = leadsController;
