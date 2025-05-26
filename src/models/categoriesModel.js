const db = require('../config/db');

class Categories {
  constructor(data = {}) {
    console.log('>> Construindo Categories com os dados');
    this.id = data.id || null;
    this.nome_categoria = data.nome_categoria || null;
    this.descricao = data.descricao || null;
  }
  
  static async create({ nome_categoria, descricao }) {
    try {
      console.log('Inserindo dados na tabela: categorias com dados:', {
        nome_categoria,
        descricao
      });
      
      const insertQuery = 'INSERT INTO categorias (nome_categoria, descricao) VALUES ($1, $2) RETURNING *';
      const result = await db.query(insertQuery, [nome_categoria, descricao]);
      return new Categories(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const selectQuery = 'SELECT * FROM categorias ORDER BY nome_categoria ASC';
      const result = await db.query(selectQuery);
      return result.rows.map(row => new Categories(row));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }
}

module.exports = Categories;
