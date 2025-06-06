const Joi = require('joi');

class EventCategories {
  static get schema() {
    return Joi.object({
      id_evento: Joi.number().integer().required(),
      id_categoria: Joi.number().integer().required()
    });
  }
}

module.exports = EventCategories; 