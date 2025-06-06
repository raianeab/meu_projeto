const supabase = require('../config/db');
const Categories = require('../models/categoriesModel');

const categoriesController = {
  async create(req, res) {
    try {
      const { error, value } = Categories.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { nome_categoria, descricao } = value;
      const { data, error: supabaseError } = await supabase
        .from('categorias')
        .insert([{ nome_categoria, descricao }])
        .select();

      if (supabaseError) throw supabaseError;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome_categoria', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    try {
      const { error, value } = Categories.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const { nome_categoria, descricao } = value;
      
      const { data, error: supabaseError } = await supabase
        .from('categorias')
        .update({ nome_categoria, descricao })
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) throw supabaseError;
      if (!data) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json({ message: 'Categoria removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async list(req, res) {
    try {
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado');
      }

      const { data: categories, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome_categoria', { ascending: true });

      if (error) throw error;

      return res.render('pages/categories', {
        categories: categories || [],
        user: req.session?.user || null
      });

    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      return res.render('pages/categories', {
        categories: [],
        error: 'Erro ao carregar categorias. Por favor, tente novamente mais tarde.'
      });
    }
  }
};

module.exports = categoriesController;