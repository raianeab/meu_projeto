const db = require('../config/db');
const eventFeedbacksModel = require('../models/eventFeedbacksModel');

class EventFeedbacksRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM eventos_feedbacks');
      return result.rows.map(row => new eventFeedbacksModel(row));
    } catch (error) {
      console.error('Erro ao buscar eventos_feedbacks no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(eventFeedbacksData) {
    try {
      const result = await eventFeedbacksModel.create(eventFeedbacksData);
      return result;
    } catch (error) {
      console.error('Erro ao criar evento_feedback no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new EventFeedbacksRepository(); 