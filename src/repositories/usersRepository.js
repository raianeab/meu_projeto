const db = require('../config/db');
const usersModel = require('../models/usersModel');

class UsersRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM usuarios ORDER BY nome_completo ASC');
      return result.rows.map(row => new usersModel(row));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async create(usersData) {
    try {
      const result = await usersModel.create(usersData);
      return result;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const result = await usersModel.findById(id);
      return result;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  async update(id, usersData) {
    try {
      const result = await usersModel.update(id, usersData);
      return result;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await usersModel.delete(id);
      return result;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}

module.exports = new UsersRepository();
