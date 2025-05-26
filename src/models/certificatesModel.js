const db = require('../config/db');

class Certificates {
  constructor(data = {}) {
    console.log('>> Construindo Certificates com os dados');
    this.id = data.id || null;
    this.id_inscricao = data.id_inscricao || null;
    this.caminho_arquivo = data.caminho_arquivo || null;
    this.data_emissao = data.data_emissao || null;
  }
  
  static async create({ id_inscricao, caminho_arquivo, data_emissao }) {
    try {
      const insertQuery = 'INSERT INTO certificados (id_inscricao, caminho_arquivo, data_emissao) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(insertQuery, [id_inscricao, caminho_arquivo, data_emissao]);
      return new Certificates(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar certificado:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const selectQuery = 'SELECT * FROM certificados ORDER BY data_emissao DESC';
      const result = await db.query(selectQuery);
      return result.rows.map(row => new Certificates(row));
    } catch (error) {
      console.error('Erro ao buscar certificados:', error);
      throw error;
    }
  }
}

module.exports = Certificates;
