const db = require('../config/db');
const eventsModel = require('../models/eventsModel');

class EventsRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM eventos');
      return result.rows.map(row => new eventsModel(row));

      return result.rows.map(row => new eventsModel(row));
    } catch (error) {
      console.error('Erro ao buscar eventos no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(eventsData) {
    try {
      const result = await eventsModel.create(eventsData);
      return result;
    } catch (error) {
      console.error('Erro ao criar evento no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new EventsRepository();
