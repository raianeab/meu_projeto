const eventFeedbacksService = require('../services/eventFeedbacksService');

module.exports = {
  async index(req, res) {
    try {
      console.log('Buscando eventos_feedbacks no controller');
      const eventFeedbacks = await eventFeedbacksService.findAll();
      res.status(200).json(eventFeedbacks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { id_evento, id_usuario, avaliacao, comentario } = req.body;

      const novoEventFeedback = await eventFeedbacksService.create({ 
        id_evento, 
        id_usuario,
        avaliacao,
        comentario
      });
      res.status(201).json(novoEventFeedback);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}; 