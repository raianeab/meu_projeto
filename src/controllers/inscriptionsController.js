const supabase = require('../config/db');
const Inscriptions = require('../models/inscriptionsModel');

const inscriptionsController = {
  async create(req, res) {
    try {
      const { error, value } = Inscriptions.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id_evento, id_usuario } = value;
      const { data, error: supabaseError } = await supabase
        .from('inscricoes')
        .insert([{
          id_evento,
          id_usuario,
          status: 'pendente',
          certificado_emitido: false,
          data_inscricao: new Date().toISOString()
        }])
        .select();

      if (supabaseError) throw supabaseError;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('inscricoes')
        .select('*')
        .order('data_inscricao', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('inscricoes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    try {
      const { error, value } = Inscriptions.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const { id_evento, id_usuario, status } = value;
      
      const { data, error: supabaseError } = await supabase
        .from('inscricoes')
        .update({ id_evento, id_usuario, status })
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) throw supabaseError;
      if (!data) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao atualizar inscrição:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('inscricoes')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }
      
      res.json({ message: 'Inscrição removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async list(req, res) {
    try {
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado');
      }

      const { data: inscriptions, error: inscriptionsError } = await supabase
        .from('inscricoes')
        .select('*')
        .order('data_inscricao', { ascending: false });

      if (inscriptionsError) throw inscriptionsError;

      const { data: eventos, error: eventosError } = await supabase
        .from('eventos')
        .select('*')
        .order('data_inicio', { ascending: false });

      if (eventosError) throw eventosError;

      const { data: usuarios, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome_completo', { ascending: true });

      if (usuariosError) throw usuariosError;

      const formattedInscriptions = inscriptions.map(inscription => {
        const evento = eventos.find(e => e.id === inscription.id_evento);
        const usuario = usuarios.find(u => u.id === inscription.id_usuario);

        return {
          id: inscription.id,
          evento_nome: evento?.titulo || 'Evento não encontrado',
          usuario_nome: usuario?.nome_completo || 'Usuário não encontrado',
          status: inscription.status,
          data_inscricao: inscription.data_inscricao,
          id_evento: inscription.id_evento,
          id_usuario: inscription.id_usuario
        };
      });

      return res.render('pages/inscriptions', {
        inscriptions: formattedInscriptions || [],
        eventos: eventos || [],
        usuarios: usuarios || [],
        error: null
      });

    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      return res.render('pages/inscriptions', {
        inscriptions: [],
        eventos: [],
        usuarios: [],
        error: 'Erro ao carregar inscrições. Por favor, tente novamente mais tarde.'
      });
    }
  }
};

module.exports = inscriptionsController; 