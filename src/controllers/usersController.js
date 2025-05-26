const usersService = require('../services/usersService');

module.exports = {
    async index(req, res) {
        try {
            console.log('Buscando usuários no controller');
            const users = await usersService.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const { nome_completo, tipo_usuario } = req.body;
            const novoUser = await usersService.create({ nome_completo, tipo_usuario });
            res.status(201).json(novoUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params;
            const user = await usersService.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome_completo, tipo_usuario } = req.body;
            const user = await usersService.update(id, { nome_completo, tipo_usuario });
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await usersService.delete(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};