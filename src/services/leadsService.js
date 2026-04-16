const leadsRepository = require('../repositories/leadsRepository');

const leadsService = {

  async register({ nome, nome_empresa, email }) {
    // Verifica duplicata pelo e-mail
    const existing = await leadsRepository.findByEmail(email);
    if (existing) {
      // Não expõe que o e-mail já existe — responde como sucesso
      return { duplicate: true };
    }

    const lead = await leadsRepository.create({ nome, nome_empresa, email });
    return { lead };
  },

};

module.exports = leadsService;
