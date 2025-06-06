const supabase = require('../config/db');
const Users = require('../models/usersModel');

const usersController = {
    async create(req, res) {
        try {
            const { error, value } = Users.schema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { nome_completo, tipo_usuario } = value;
            const { data, error: supabaseError } = await supabase
                .from('usuarios')
                .insert([{
                    nome_completo,
                    tipo_usuario,
                    data_criacao: new Date().toISOString()
                }])
                .select();

            if (supabaseError) throw supabaseError;
            res.status(201).json(data[0]);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async findAll(req, res) {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .order('nome_completo', { ascending: true });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async findById(req, res) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            res.json(data);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async update(req, res) {
        try {
            const { error, value } = Users.schema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { id } = req.params;
            const { nome_completo, tipo_usuario } = value;
            
            const { data, error: supabaseError } = await supabase
                .from('usuarios')
                .update({ nome_completo, tipo_usuario })
                .eq('id', id)
                .select()
                .single();
            
            if (supabaseError) throw supabaseError;
            if (!data) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            res.json(data);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase
                .from('usuarios')
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            res.json({ message: 'Usuário removido com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async list(req, res) {
        try {
            console.log('Iniciando busca de usuários...');
            
            // Verifica se o Supabase está configurado
            if (!supabase) {
                throw new Error('Cliente Supabase não inicializado');
            }

             // Busca todos os usuários
            const { data: users, error } = await supabase
                .from('usuarios')
                .select('*')
                .order('nome_completo', { ascending: true });

            if (error) {
                console.error('Erro ao buscar usuários no Supabase:', error);
                throw error;
            }

            console.log(`Usuários encontrados: ${users?.length || 0}`);

            // Formata os dados para a view
            const formattedUsers = users.map(user => ({
                id: user.id,
                nome_completo: user.nome_completo,
                email: user.email || '',
                telefone: user.telefone || '',
                tipo_usuario: user.tipo_usuario,
                data_cadastro: user.data_cadastro
            }));

            // Renderiza a página com os dados
            return res.render('pages/users', {
                users: formattedUsers || [],
                error: null
            });

        } catch (error) {
            console.error('Erro detalhado ao listar usuários:', error);
            // Renderiza a página com erro
            return res.render('pages/users', {
                users: [],
                error: 'Erro ao carregar usuários. Por favor, tente novamente mais tarde.'
            });
        }
    }
};

module.exports = usersController;