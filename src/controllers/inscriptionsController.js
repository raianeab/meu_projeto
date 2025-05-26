const inscriptionsService = require('../services/inscriptionsService');

module.exports = {
  async index(req, res) {
    try {
      console.log('Buscando inscrições no controller');
      const inscriptions = await inscriptionsService.findAll();
      res.status(200).json(inscriptions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { id_evento, id_usuario } = req.body;

      const novaInscricao = await inscriptionsService.create({ 
        id_evento, 
        id_usuario,
        
      });
      res.status(201).json(novaInscricao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}; 