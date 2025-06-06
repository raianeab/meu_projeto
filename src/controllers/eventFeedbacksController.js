const supabase = require('../config/db');
const EventFeedbacks = require('../models/eventFeedbacksModel');

const eventFeedbacksController = {
  async create(req, res) {
    try {
      const { error, value } = EventFeedbacks.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id_evento, id_usuario, avaliacao, comentario } = value;
      const { data, error: supabaseError } = await supabase
        .from('eventos_feedbacks')
        .insert([{ 
          id_evento, 
          id_usuario, 
          avaliacao, 
          comentario
        }])
        .select();

      if (supabaseError) throw supabaseError;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Erro ao criar feedback do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('eventos_feedbacks')
        .select('*')
        .order('data_envio', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar feedbacks dos eventos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('eventos_feedbacks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Feedback do evento não encontrado' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar feedback do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    try {
      const { error, value } = EventFeedbacks.schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const { id_evento, id_usuario, avaliacao, comentario } = value;
      
      const { data, error: supabaseError } = await supabase
        .from('eventos_feedbacks')
        .update({ id_evento, id_usuario, avaliacao, comentario })
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) throw supabaseError;
      if (!data) {
        return res.status(404).json({ error: 'Feedback do evento não encontrado' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Erro ao atualizar feedback do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('eventos_feedbacks')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Feedback do evento não encontrado' });
      }
      
      res.json({ message: 'Feedback do evento removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar feedback do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async list(req, res) {
    try {
      console.log('Iniciando busca de feedbacks...');
      
      // Verifica se o Supabase está configurado
      if (!supabase) {
        console.error('Erro: Cliente Supabase não inicializado');
        throw new Error('Cliente Supabase não inicializado');
      }

      console.log('Cliente Supabase inicializado, testando conexão com a tabela eventos_feedbacks...');

      // Testa a conexão com a tabela
      const { data: testData, error: testError } = await supabase
        .from('eventos_feedbacks')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Erro ao testar conexão com a tabela eventos_feedbacks:', {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        });
        throw testError;
      }

      console.log('Conexão com a tabela eventos_feedbacks OK, buscando dados...');

      // Busca todos os feedbacks
      const { data: feedbacks, error: feedbacksError } = await supabase
        .from('eventos_feedbacks')
        .select('*')
        .order('data_envio', { ascending: false });

      if (feedbacksError) {
        console.error('Erro detalhado ao buscar feedbacks:', {
          message: feedbacksError.message,
          details: feedbacksError.details,
          hint: feedbacksError.hint,
          code: feedbacksError.code
        });
        throw feedbacksError;
      }

      console.log('Feedbacks encontrados:', feedbacks?.length || 0);

      // Busca todos os eventos
      console.log('Buscando eventos...');
      const { data: eventos, error: eventosError } = await supabase
        .from('eventos')
        .select('*');

      if (eventosError) {
        console.error('Erro detalhado ao buscar eventos:', {
          message: eventosError.message,
          details: eventosError.details,
          hint: eventosError.hint,
          code: eventosError.code
        });
        throw eventosError;
      }

      console.log('Eventos encontrados:', eventos?.length || 0);

      // Busca todos os usuários
      console.log('Buscando usuários...');
      const { data: usuarios, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*');

      if (usuariosError) {
        console.error('Erro detalhado ao buscar usuários:', {
          message: usuariosError.message,
          details: usuariosError.details,
          hint: usuariosError.hint,
          code: usuariosError.code
        });
        throw usuariosError;
      }

      console.log('Usuários encontrados:', usuarios?.length || 0);

      // Formata os dados para a view
      const formattedFeedbacks = feedbacks?.map(feedback => {
        // Encontra o evento e usuário relacionados
        const evento = eventos?.find(e => e.id === feedback.id_evento);
        const usuario = usuarios?.find(u => u.id === feedback.id_usuario);

        return {
          id: feedback.id,
          evento_nome: evento?.titulo || 'Evento não encontrado',
          participante_nome: usuario?.nome_completo || 'Participante não encontrado',
          data_feedback: feedback.data_envio,
          avaliacao: feedback.avaliacao,
          comentario: feedback.comentario,
          id_evento: feedback.id_evento,
          id_usuario: feedback.id_usuario
        };
      }) || [];

      console.log('Feedbacks formatados:', formattedFeedbacks.length);

      // Renderiza a página com os dados
      return res.render('pages/event-feedback', {
        feedbacks: formattedFeedbacks,
        eventos: eventos || [],
        participantes: usuarios || [],
        error: null
      });

    } catch (error) {
      console.error('Erro detalhado ao listar feedbacks:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        stack: error.stack
      });
      // Renderiza a página com erro
      return res.render('pages/event-feedback', {
        feedbacks: [],
        eventos: [],
        participantes: [],
        error: 'Erro ao carregar feedbacks. Por favor, tente novamente mais tarde.'
      });
    }
  }
};

module.exports = eventFeedbacksController; 