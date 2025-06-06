const db = require('../config/db');
const categoriesModel = require('../models/categoriesModel');

class CategoriesRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM categorias');
      return result.rows.map(row => new categoriesModel(row));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  async create(categoriesData) {
    try {
      const { nome_categoria, descricao } = categoriesData;
      const result = await categoriesModel.create({ nome_categoria, descricao });
      return result;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }
}

module.exports = new CategoriesRepository();
