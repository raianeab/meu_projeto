const Users = require('../models/usersModel');
const usersRepository = require('../repositories/usersRepository');
const bcrypt = require('bcrypt');

const usersController = {
    async create(req, res) {
        try {
            const { error, value } = Users.schema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { nome_completo, email, telefone, tipo_usuario, senha } = value;
            const session = req.session.user;

            if (email) {
                const exists = await usersRepository.emailExists(session, email);
                if (exists) return res.status(400).json({ error: 'Este email já está em uso' });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);
            const user = await usersRepository.create(session, {
                nome_completo, email, telefone, tipo_usuario, senha: hashedPassword
            });
            res.status(201).json(user);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async findAll(req, res) {
        try {
            const users = await usersRepository.findAll(req.session.user);
            res.json(users);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async findById(req, res) {
        try {
            const user = await usersRepository.findById(req.session.user, req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json(user);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async update(req, res) {
        try {
            const { error, value } = Users.schema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { id } = req.params;
            const { nome_completo, email, telefone, tipo_usuario, senha } = value;
            const session = req.session.user;

            if (email) {
                const exists = await usersRepository.emailExists(session, email, id);
                if (exists) return res.status(400).json({ error: 'Este email já está em uso' });
            }

            const hashedPassword = senha ? await bcrypt.hash(senha, 10) : null;
            const user = await usersRepository.update(session, id, {
                nome_completo, email, telefone, tipo_usuario, senha: hashedPassword
            });
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json(user);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await usersRepository.delete(req.session.user, req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json({ message: 'Usuário removido com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async list(req, res) {
        try {
            const users = await usersRepository.findAll(req.session.user);
            const formattedUsers = users.map(user => ({
                id: user.id,
                nome_completo: user.nome_completo,
                email: user.email || '',
                telefone: user.telefone || '',
                tipo_usuario: user.tipo_usuario,
                data_cadastro: user.created_at
            }));
            return res.render('pages/users', { users: formattedUsers, error: null });
        } catch (error) {
            console.error('Erro detalhado ao listar usuários:', error);
            return res.render('pages/users', { users: [], error: 'Erro ao carregar usuários. Por favor, tente novamente mais tarde.' });
        }
    }
};

module.exports = usersController;
