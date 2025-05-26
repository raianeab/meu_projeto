const db = require('../config/db');
const eventCategoriesModel = require('../models/eventCategoriesModel');

class EventCategoriesRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM eventos_categorias');
      return result.rows.map(row => new eventCategoriesModel(row));
    } catch (error) {
      console.error('Erro ao buscar eventos_categorias no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(eventCategoriesData) {
    try {
      const result = await eventCategoriesModel.create(eventCategoriesData);
      return result;
    } catch (error) {
      console.error('Erro ao criar evento_categoria no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new EventCategoriesRepository(); 