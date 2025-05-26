const inscriptionsRepository = require('../repositories/inscriptionsRepository');

class InscriptionsService {
  async findAll() {
    try {
      console.log('Buscando inscrições no service');
      return await inscriptionsRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar inscrições no service:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(inscriptionsData) {
    try {
      console.log('Criando inscrição no service com dados:', inscriptionsData);
      return await inscriptionsRepository.create(inscriptionsData);
    } catch (error) {
      console.error('Erro ao criar inscrição no service:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new InscriptionsService(); 