const eventFeedbacksRepository = require('../repositories/eventFeedbacksRepository');

class EventFeedbacksService {
  async findAll() {
    try {
      return await eventFeedbacksRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar eventos_feedbacks:', error);
      throw error;
    }
  }

  async create(eventFeedbacksData) {
    try {
      return await eventFeedbacksRepository.create(eventFeedbacksData);
    } catch (error) {
      console.error('Erro ao criar evento_feedback:', error);
      throw error;
    }
  }
}

module.exports = new EventFeedbacksService(); 