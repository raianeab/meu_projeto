const db = require('../config/db');
const inscriptionsModel = require('../models/inscriptionsModel');

class InscriptionsRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM inscricoes');
      return result.rows.map(row => new inscriptionsModel(row));
    } catch (error) {
      console.error('Erro ao buscar inscrições no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(inscriptionsData) {
    try {
      const result = await inscriptionsModel.create(inscriptionsData);
      return result;
    } catch (error) {
      console.error('Erro ao criar inscrição no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new InscriptionsRepository(); 