const eventCategoriesService = require('../services/eventCategoriesService');

module.exports = {
  async index(req, res) {
    try {
      console.log('Buscando eventos_categorias no controller');
      const eventCategories = await eventCategoriesService.findAll();
      res.status(200).json(eventCategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { id_evento, id_categoria } = req.body;

      const novaEventCategory = await eventCategoriesService.create({ 
        id_evento, 
        id_categoria
      });
      res.status(201).json(novaEventCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}; 