const db = require('../config/db');
const categoriesModel = require('../models/categoriesModel');

class CategoriesRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM categorias');
      return result.rows.map(row => new categoriesModel(row));
    } catch (error) {
      console.error('Erro ao buscar categorias no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(categoriesData) {
    try {
      console.log('Criando categoria no repository com dados:', categoriesData);
      const { nome_categoria, descricao } = categoriesData;
      const result = await categoriesModel.create({ nome_categoria, descricao });
      return result;
    } catch (error) {
      console.error('Erro ao criar categoria no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new CategoriesRepository();
