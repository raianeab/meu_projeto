const db = require('../config/db');

class Users {
  constructor(data = {}) {
    console.log('>> Construindo Users com os dados');
    this.id = data.id || null;
    this.nome_completo = data.nome_completo || null; 
    this.tipo_usuario = data.tipo_usuario || null;
    this.data_criacao = data.data_criacao || null;
  }
  
  static async create({ nome_completo, tipo_usuario }) {
    try {
      const insertQuery = 'INSERT INTO usuarios (nome_completo, tipo_usuario, data_criacao) VALUES ($1, $2, CURRENT_TIMESTAMP AT TIME ZONE \'UTC\') RETURNING *';
      const result = await db.query(insertQuery, [nome_completo, tipo_usuario]);
      return new Users(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const selectQuery = 'SELECT * FROM usuarios ORDER BY nome_completo ASC';
      const result = await db.query(selectQuery);
      return result.rows.map(row => new Users(row));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const selectQuery = 'SELECT * FROM usuarios WHERE id = $1';
      const result = await db.query(selectQuery, [id]);
      return result.rows[0] ? new Users(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  static async update(id, { nome_completo, tipo_usuario }) {
    try {
      const updateQuery = 'UPDATE usuarios SET nome_completo = $1, tipo_usuario = $2 WHERE id = $3 RETURNING *';
      const result = await db.query(updateQuery, [nome_completo, tipo_usuario, id]);
      return result.rows[0] ? new Users(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const deleteQuery = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
      const result = await db.query(deleteQuery, [id]);
      return result.rows[0] ? new Users(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}

module.exports = Users;
