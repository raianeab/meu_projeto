const supabase = require('../config/db');
const Users = require('../models/usersModel');
const bcrypt = require('bcrypt');

const usersController = {
    async create(req, res) {
        try {
            const { error, value } = Users.schema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { nome_completo, email, telefone, tipo_usuario, senha } = value;

            const { data: existingUser } = await supabase
                .from('usuarios')
                .select('email')
                .eq('email', email)
                .single();

            if (existingUser) {
                return res.status(400).json({ error: 'Este email já está em uso' });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

            const { data, error: supabaseError } = await supabase
                .from('usuarios')
                .insert([{
                    nome_completo,
                    email,
                    telefone,
                    tipo_usuario,
                    senha: hashedPassword
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
            
            const { senha, ...userWithoutPassword } = data;
            res.json(userWithoutPassword);
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
            const { nome_completo, email, telefone, tipo_usuario, senha } = value;

            if (email) {
                const { data: existingUser } = await supabase
                    .from('usuarios')
                    .select('email')
                    .eq('email', email)
                    .neq('id', id)
                    .single();

                if (existingUser) {
                    return res.status(400).json({ error: 'Este email já está em uso' });
                }
            }
            
            const updateData = {
                nome_completo,
                email,
                telefone,
                tipo_usuario
            };

            if (senha) {
                updateData.senha = await bcrypt.hash(senha, 10);
            }
            
            const { data, error: supabaseError } = await supabase
                .from('usuarios')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            
            if (supabaseError) throw supabaseError;
            if (!data) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            const { senha: _, ...userWithoutPassword } = data;
            res.json(userWithoutPassword);
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
            
            if (!supabase) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data: users, error } = await supabase
                .from('usuarios')
                .select('*')
                .order('nome_completo', { ascending: true });

            if (error) {
                console.error('Erro ao buscar usuários no Supabase:', error);
                throw error;
            }

            console.log(`Usuários encontrados: ${users?.length || 0}`);

            const formattedUsers = users.map(user => ({
                id: user.id,
                nome_completo: user.nome_completo,
                email: user.email || '',
                telefone: user.telefone || '',
                tipo_usuario: user.tipo_usuario,
                data_cadastro: user.created_at
            }));

            return res.render('pages/users', {
                users: formattedUsers || [],
                error: null
            });

        } catch (error) {
            console.error('Erro detalhado ao listar usuários:', error);
            return res.render('pages/users', {
                users: [],
                error: 'Erro ao carregar usuários. Por favor, tente novamente mais tarde.'
            });
        }
    }
};

module.exports = usersController;