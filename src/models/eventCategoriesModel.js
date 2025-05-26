const db = require('../config/db');

class EventCategories {
  constructor(data = {}) {
    console.log('>> Construindo EventCategories com os dados');
    this.id = data.id || null;
    this.id_evento = data.id_evento || null;
    this.id_categoria = data.id_categoria || null;
  }
  
  static async create({ id_evento, id_categoria }) {
    try {
      const insertQuery = 'INSERT INTO eventos_categorias (id_evento, id_categoria) VALUES ($1, $2) RETURNING *';
      const result = await db.query(insertQuery, [id_evento, id_categoria]);
      return new EventCategories(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar evento_categoria:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const selectQuery = 'SELECT * FROM eventos_categorias';
      const result = await db.query(selectQuery);
      return result.rows.map(row => new EventCategories(row));
    } catch (error) {
      console.error('Erro ao buscar eventos_categorias:', error);
      throw error;
    }
  }
}

module.exports = EventCategories; 