const Joi = require('joi');

class EventFeedbacks {
  static get schema() {
    return Joi.object({
      id_evento: Joi.string().uuid().required(),
      id_usuario: Joi.string().uuid().required(),
      avaliacao: Joi.number().integer().min(1).max(5).required(),
      comentario: Joi.string().allow('').required()
    });
  }
}

module.exports = EventFeedbacks; 