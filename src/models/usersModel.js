const Joi = require('joi');

class Users {
  static get schema() {
    return Joi.object({
      nome_completo: Joi.string().max(100).required(),
      tipo_usuario: Joi.string().valid('admin', 'organizador', 'participante').required()
    });
  }
}

module.exports = Users;
