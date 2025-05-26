const eventsService = require('../services/eventsService');

module.exports = {
    async index(req, res) {
        try {
            console.log('Buscando eventos no controller');
            const events = await eventsService.findAll();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
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
            } = req.body;

            const novoEvent = await eventsService.create({ 
                titulo, 
                descricao, 
                local, 
                data_inicio, 
                data_fim, 
                tipo_evento, 
                vagas_disponiveis, 
                publico_alvo, 
                id_organizador 
            });
            res.status(201).json(novoEvent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }   
}