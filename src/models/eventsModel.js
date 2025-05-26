const db = require('../config/db');

class Events {
  constructor(data = {}) {
    console.log('>> Construindo Events com os dados');
    this.id = data.id || null;
    this.titulo = data.titulo || null;
    this.descricao = data.descricao || null;
    this.local = data.local || null;
    this.data_inicio = data.data_inicio || null;
    this.data_fim = data.data_fim || null;
    this.tipo_evento = data.tipo_evento || null;
    this.vagas_disponiveis = data.vagas_disponiveis || null;
    this.publico_alvo = data.publico_alvo || null;
    this.status = data.status || 'ativo';
    this.data_criacao = data.data_criacao || null;
    this.id_organizador = data.id_organizador || null;
  }
  
  static async create({ titulo, descricao, local, data_inicio, data_fim, tipo_evento, vagas_disponiveis, publico_alvo, id_organizador }) {
    try {
      const insertQuery = 'INSERT INTO eventos (titulo, descricao, local, data_inicio, data_fim, tipo_evento, vagas_disponiveis, publico_alvo, id_organizador) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      const result = await db.query(insertQuery, [titulo, descricao, local, data_inicio, data_fim, tipo_evento, vagas_disponiveis, publico_alvo, id_organizador]);
      return new Events(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const selectQuery = 'SELECT * FROM eventos ORDER BY data_inicio ASC';
      const result = await db.query(selectQuery);
      return result.rows.map(row => new Events(row));
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }
}

module.exports = Events;
