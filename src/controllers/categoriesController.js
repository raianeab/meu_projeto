const categoriesService = require('../services/categoriesService');

module.exports = {
    async index(req, res) {
        try {
            console.log('Buscando categorias no controller');
            const categories = await categoriesService.findAll();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const { nome_categoria, descricao } = req.body;
            const novoCategory = await categoriesService.create({ nome_categoria, descricao });
            res.status(201).json(novoCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }   
}