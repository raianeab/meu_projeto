const Joi = require('joi');

class Users {
  static get schema() {
    return Joi.object({
      nome_completo: Joi.string().max(100).required(),
      email: Joi.string().email().allow('').optional(),
      senha: Joi.string().min(6).required(),
      telefone: Joi.string().allow('').optional(),
      tipo_usuario: Joi.string().valid('admin', 'organizador', 'participante').required()
    });
  }
}

module.exports = Users;
