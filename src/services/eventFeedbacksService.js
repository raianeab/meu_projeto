const eventFeedbacksRepository = require('../repositories/eventFeedbacksRepository');

class EventFeedbacksService {
  async findAll() {
    try {
      console.log('Buscando eventos_feedbacks no service');
      return await eventFeedbacksRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar eventos_feedbacks no service:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(eventFeedbacksData) {
    try {
      console.log('Criando evento_feedback no service com dados:', eventFeedbacksData);
      return await eventFeedbacksRepository.create(eventFeedbacksData);
    } catch (error) {
      console.error('Erro ao criar evento_feedback no service:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new EventFeedbacksService(); 