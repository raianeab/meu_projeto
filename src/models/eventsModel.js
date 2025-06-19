const Joi = require('joi');

class Events {
  static get schema() {
    return Joi.object({
      titulo: Joi.string().max(100).required(),
      descricao: Joi.string().required(),
      local: Joi.string().max(200).required(),
      data_inicio: Joi.date().required(),
      data_fim: Joi.date().min(Joi.ref('data_inicio')).required(),
      tipo_evento: Joi.string().max(50).required(),
      vagas_disponiveis: Joi.number().integer().min(0).required(),
      publico_alvo: Joi.string().max(200).required(),
      id_organizador: Joi.string().uuid().required(),
      id_categoria: Joi.string().uuid().required()
    });
  }
}

module.exports = Events;
