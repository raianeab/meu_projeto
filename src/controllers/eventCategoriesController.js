const supabase = require('../config/db');
const EventCategories = require('../models/eventCategoriesModel');

const eventCategoriesController = {
  async create(req, res) {
    try {
      const { error, value } = EventCategories.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id_evento, id_categoria } = value;
      const { data, error: supabaseError } = await supabase
        .from('eventos_categorias')
        .insert([{ id_evento, id_categoria }])
        .select();

      if (supabaseError) throw supabaseError;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Erro ao criar categoria do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('eventos_categorias')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar categorias dos eventos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('eventos_categorias')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Categoria do evento não encontrada' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar categoria do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    try {
      const { error, value } = EventCategories.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const { id_evento, id_categoria } = value;
      
      const { data, error: supabaseError } = await supabase
        .from('eventos_categorias')
        .update({ id_evento, id_categoria })
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) throw supabaseError;
      if (!data) {
        return res.status(404).json({ error: 'Categoria do evento não encontrada' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao atualizar categoria do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('eventos_categorias')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Categoria do evento não encontrada' });
      }
      
      res.json({ message: 'Categoria do evento removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = eventCategoriesController; 