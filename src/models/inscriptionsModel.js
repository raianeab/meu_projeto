const db = require('../config/db');

class Inscriptions {
  constructor(data = {}) {
    console.log('>> Construindo Inscriptions com os dados');
    this.id = data.id || null;
    this.id_evento = data.id_evento || null;
    this.id_usuario = data.id_usuario || null;
    this.data_inscricao = data.data_inscricao || new Date();
    this.status = data.status || 'pendente';
    this.certificado_emitido = data.certificado_emitido || false;
  }
  
  static async create({ id_evento, id_usuario }) {
    try {
      const insertQuery = 'INSERT INTO inscricoes (id_evento, id_usuario) VALUES ($1, $2) RETURNING *';
      const result = await db.query(insertQuery, [id_evento, id_usuario]);
      return new Inscriptions(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const selectQuery = 'SELECT * FROM inscricoes ORDER BY data_inscricao DESC';
      const result = await db.query(selectQuery);
      return result.rows.map(row => new Inscriptions(row));
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      throw error;
    }
  }
}

module.exports = Inscriptions; 