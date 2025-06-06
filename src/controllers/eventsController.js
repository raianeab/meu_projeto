const supabase = require('../config/db');
const Events = require('../models/eventsModel');

const eventsController = {
  async create(req, res) {
    try {
      const { error, value } = Events.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { 
        titulo, 
        descricao, 
        local, 
        data_inicio, 
        data_fim, 
        tipo_evento, 
        vagas_disponiveis, 
        publico_alvo, 
        id_organizador 
      } = value;

      const { data, error: supabaseError } = await supabase
        .from('eventos')
        .insert([{
          titulo,
          descricao,
          local,
          data_inicio,
          data_fim,
          tipo_evento,
          vagas_disponiveis,
          publico_alvo,
          id_organizador,
          status: 'ativo'
        }])
        .select();

      if (supabaseError) throw supabaseError;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data_inicio', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    try {
      const { error, value } = Events.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const { 
        titulo, 
        descricao, 
        local, 
        data_inicio, 
        data_fim, 
        tipo_evento, 
        vagas_disponiveis, 
        publico_alvo, 
        id_organizador 
      } = value;
      
      const { data, error: supabaseError } = await supabase
        .from('eventos')
        .update({
          titulo,
          descricao,
          local,
          data_inicio,
          data_fim,
          tipo_evento,
          vagas_disponiveis,
          publico_alvo,
          id_organizador
        })
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) throw supabaseError;
      if (!data) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }
      
      res.json({ message: 'Evento removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async list(req, res) {
    try {
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado');
      }

      const { data: events, error: eventsError } = await supabase
        .from('eventos')
        .select('*')
        .order('data_inicio', { ascending: false });

      if (eventsError) throw eventsError;

      const { data: categories, error: categoriesError } = await supabase
        .from('categorias')
        .select('*');

      if (categoriesError) throw categoriesError;

      const { data: eventCategories, error: eventCategoriesError } = await supabase
        .from('eventos_categorias')
        .select('*');

      if (eventCategoriesError) throw eventCategoriesError;

      const formattedEvents = events.map(event => {
        const eventCategory = eventCategories?.find(ec => ec.id_evento === event.id);
        const category = categories?.find(c => c.id === eventCategory?.id_categoria);

        return {
          id: event.id,
          titulo: event.titulo,
          data_inicio: event.data_inicio,
          data_fim: event.data_fim,
          local: event.local,
          tipo_evento: event.tipo_evento,
          categoria_nome: category?.nome_categoria || 'Sem categoria',
          vagas_disponiveis: event.vagas_disponiveis,
          publico_alvo: event.publico_alvo,
          status: event.status || 'ativo'
        };
      });

      return res.render('pages/events', {
        events: formattedEvents || [],
        categorias: categories || [],
        error: null
      });

    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      return res.render('pages/events', {
        events: [],
        categorias: [],
        error: 'Erro ao carregar eventos. Por favor, tente novamente mais tarde.'
      });
    }
  }
};

module.exports = eventsController;