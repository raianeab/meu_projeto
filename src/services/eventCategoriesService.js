const eventCategoriesRepository = require('../repositories/eventCategoriesRepository');

class EventCategoriesService {
  async findAll() {
    try {
      console.log('Buscando eventos_categorias no service');
      return await eventCategoriesRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar eventos_categorias no service:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(eventCategoriesData) {
    try {
      console.log('Criando evento_categoria no service com dados:', eventCategoriesData);
      return await eventCategoriesRepository.create(eventCategoriesData);
    } catch (error) {
      console.error('Erro ao criar evento_categoria no service:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new EventCategoriesService(); 