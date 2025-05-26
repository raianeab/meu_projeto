const db = require('../config/db');
const usersModel = require('../models/usersModel');

class UsersRepository {
  async findAll() {
    try {
      console.log('Buscando todos os usuários no repository');
      const result = await db.query('SELECT * FROM usuarios ORDER BY nome_completo ASC');
      console.log('Resultados encontrados:', result.rows);
      return result.rows.map(row => new usersModel(row));
    } catch (error) {
      console.error('Erro ao buscar usuários no repository:', error);
      throw error;
    }
  }

  async create(usersData) {
    try {
      console.log('Criando usuário no repository com dados:', usersData);
      const result = await usersModel.create(usersData);
      console.log('Usuário criado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao criar usuário no repository:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      console.log('Buscando usuário por ID no repository:', id);
      const result = await usersModel.findById(id);
      return result;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID no repository:', error);
      throw error;
    }
  }

  async update(id, usersData) {
    try {
      console.log('Atualizando usuário no repository:', { id, usersData });
      const result = await usersModel.update(id, usersData);
      return result;
    } catch (error) {
      console.error('Erro ao atualizar usuário no repository:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      console.log('Deletando usuário no repository:', id);
      const result = await usersModel.delete(id);
      return result;
    } catch (error) {
      console.error('Erro ao deletar usuário no repository:', error);
      throw error;
    }
  }
}

module.exports = new UsersRepository();
