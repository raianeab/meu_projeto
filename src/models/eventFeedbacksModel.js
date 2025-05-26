const db = require('../config/db');

class EventFeedbacks {
  constructor(data = {}) {
    console.log('>> Construindo EventFeedbacks com os dados');
    this.id = data.id || null;
    this.id_evento = data.id_evento || null;
    this.id_usuario = data.id_usuario || null;
    this.avaliacao = data.avaliacao || null;
    this.comentario = data.comentario || null;
  }
  
  static async create({ id_evento, id_usuario, avaliacao, comentario }) {
    try {
      const insertQuery = 'INSERT INTO eventos_feedbacks (id_evento, id_usuario, avaliacao, comentario) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await db.query(insertQuery, [id_evento, id_usuario, avaliacao, comentario]);
      return new EventFeedbacks(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar feedback de evento:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const selectQuery = 'SELECT * FROM eventos_feedbacks';
      const result = await db.query(selectQuery);
      return result.rows.map(row => new EventFeedbacks(row));
    } catch (error) {
      console.error('Erro ao buscar feedbacks de eventos:', error);
      throw error;
    }
  }
}

module.exports = EventFeedbacks; 