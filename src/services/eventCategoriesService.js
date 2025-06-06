const eventCategoriesRepository = require('../repositories/eventCategoriesRepository');

class EventCategoriesService {
  async findAll() {
    try {
      return await eventCategoriesRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar eventos_categorias:', error);
      throw error;
    }
  }

  async create(eventCategoriesData) {
    try {
      return await eventCategoriesRepository.create(eventCategoriesData);
    } catch (error) {
      console.error('Erro ao criar evento_categoria:', error);
      throw error;
    }
  }
}

module.exports = new EventCategoriesService(); 