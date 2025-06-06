const inscriptionsRepository = require('../repositories/inscriptionsRepository');

class InscriptionsService {
  async findAll() {
    try {
      return await inscriptionsRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      throw error;
    }
  }

  async create(inscriptionsData) {
    try {
      return await inscriptionsRepository.create(inscriptionsData);
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }
  }
}

module.exports = new InscriptionsService(); 