const certificatesService = require('../services/certificatesService');

module.exports = {
    async index(req, res) {
        try {
            console.log('Buscando certificados no controller');
            const certificates = await certificatesService.findAll();
            res.status(200).json(certificates);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const { 
                id_inscricao, 
                caminho_arquivo, 
                data_emissao, 
            } = req.body;

            const novoCertificate = await certificatesService.create({ 
                id_inscricao, 
                caminho_arquivo, 
                data_emissao, 
            });
            res.status(201).json(novoCertificate);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }   
}