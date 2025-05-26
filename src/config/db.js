const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('Inicializando cliente Supabase...');

module.exports = {
  supabase,
  query: async (text, params) => {
    try {
      console.log('Executando query:', text, 'com parâmetros:', params);

      if (text.toLowerCase().includes('insert')) {
        let tableName = 'usuarios';
        let insertData = { 
          nome_completo: params[0],
          tipo_usuario: params[1]
        };

        if (text.toLowerCase().includes('eventos_categorias')) {
          tableName = 'eventos_categorias';
          insertData = {
            id_evento: params[0],
            id_categoria: params[1]
          };
        } else if (text.toLowerCase().includes('categorias')) {
          tableName = 'categorias';
          insertData = { 
            nome_categoria: params[0],
            descricao: params[1]
          };
        } else if (text.toLowerCase().includes('certificados')) {
          tableName = 'certificados';
          insertData = {
            id_inscricao: params[0],
            caminho_arquivo: params[1],
            data_emissao: params[2]
          };
        } else if (text.toLowerCase().includes('inscricoes')) {
          tableName = 'inscricoes';
          insertData = {
            id_evento: params[0],
            id_usuario: params[1],
            status: 'pendente',
            certificado_emitido: false
          };
        } else if (text.toLowerCase().includes('eventos_feedbacks')) {
          tableName = 'eventos_feedbacks';
          insertData = {
            id_evento: params[0],
            id_usuario: params[1],
            avaliacao: params[2],
            comentario: params[3]
          };
        } else if (text.toLowerCase().includes('eventos')) {
          tableName = 'eventos';
          insertData = {
            titulo: params[0],
            descricao: params[1],
            local: params[2],
            data_inicio: params[3],
            data_fim: params[4],
            tipo_evento: params[5],
            vagas_disponiveis: params[6],
            publico_alvo: params[7],
            id_organizador: params[8],
            status: 'ativo'
          };
        }

        console.log('Inserindo dados na tabela:', tableName, 'com dados:', insertData);

        const { data, error } = await supabase
          .from(tableName)
          .insert([insertData])
          .select();

        if (error) {
          console.error('Erro do Supabase na inserção:', error);
          throw error;
        }

        console.log('Dados inseridos com sucesso:', data);
        return { rows: data };
      }

      if (text.toLowerCase().includes('update')) {
        let tableName = 'usuarios';
        let updateData = {};
        let id = null;

        if (text.toLowerCase().includes('usuarios')) {
          tableName = 'usuarios';
          updateData = {
            nome_completo: params[0],
            tipo_usuario: params[1]
          };
          id = params[2];
        }

        console.log('Atualizando dados na tabela:', tableName, 'com dados:', updateData, 'onde id =', id);

        const { data, error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq('id', id)
          .select();

        if (error) {
          console.error('Erro do Supabase na atualização:', error);
          throw error;
        }

        console.log('Dados atualizados com sucesso:', data);
        return { rows: data };
      }

      if (text.toLowerCase().includes('delete')) {
        let tableName = 'usuarios';
        let id = params[0];

        console.log('Deletando dados da tabela:', tableName, 'onde id =', id);

        const { data, error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          console.error('Erro do Supabase na deleção:', error);
          throw error;
        }

        console.log('Dados deletados com sucesso:', data);
        return { rows: data };
      }

      // Lógica para SELECT
      let tableName = 'usuarios';
      if (text.toLowerCase().includes('eventos_categorias')) tableName = 'eventos_categorias';
      if (text.toLowerCase().includes('categorias')) tableName = 'categorias';
      if (text.toLowerCase().includes('eventos')) tableName = 'eventos';
      if (text.toLowerCase().includes('certificados')) tableName = 'certificados';
      if (text.toLowerCase().includes('inscricoes')) tableName = 'inscricoes';
      if (text.toLowerCase().includes('eventos_feedbacks')) tableName = 'eventos_feedbacks';

      console.log('Selecionando dados da tabela:', tableName);

      let query = supabase.from(tableName).select('*');

      // Se a query inclui WHERE, aplica o filtro
      if (text.toLowerCase().includes('where')) {
        const whereMatch = text.match(/where (\w+)\s*=\s*\$\d+/i);
        if (whereMatch) {
          const column = whereMatch[1];
          const paramIndex = parseInt(text.match(/\$(\d+)/)[1]) - 1;
          const value = params[paramIndex];
          console.log('Aplicando filtro WHERE:', column, '=', value);
          query = query.eq(column, value);
        }
      }

      // Se a query inclui ORDER BY, aplica a ordenação
      if (text.toLowerCase().includes('order by')) {
        const orderByMatch = text.match(/order by (\w+)\s+(asc|desc)/i);
        if (orderByMatch) {
          const [, column, direction] = orderByMatch;
          console.log('Aplicando ordenação:', column, direction);
          query = query.order(column, { ascending: direction.toLowerCase() === 'asc' });
        }
      }

      // Se a query inclui LIMIT, aplica o limite
      if (text.toLowerCase().includes('limit')) {
        const limitMatch = text.match(/limit (\d+)/i);
        if (limitMatch) {
          const limit = parseInt(limitMatch[1]);
          console.log('Aplicando limite:', limit);
          query = query.limit(limit);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro do Supabase na seleção:', error);
        throw error;
      }

      console.log('Dados retornados com sucesso:', data);
      return { rows: data };
    } catch (error) {
      console.error('Erro ao executar query:', error);
      throw error;
    }
  },

  connect: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao conectar ao Supabase:', error);
      throw error;
    }
  }
};

