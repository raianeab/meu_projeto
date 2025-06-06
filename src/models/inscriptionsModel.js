const Joi = require('joi');

class Inscriptions {
  static get schema() {
    return Joi.object({
      id_evento: Joi.string().uuid().required().messages({
        'string.base': 'O ID do evento deve ser uma string',
        'string.guid': 'O ID do evento deve ser um UUID válido',
        'any.required': 'O ID do evento é obrigatório'
      }),
      id_usuario: Joi.string().uuid().required().messages({
        'string.base': 'O ID do usuário deve ser uma string',
        'string.guid': 'O ID do usuário deve ser um UUID válido',
        'any.required': 'O ID do usuário é obrigatório'
      }),
      status: Joi.string().valid('pendente', 'confirmada', 'cancelada').default('pendente').messages({
        'string.base': 'O status deve ser uma string',
        'any.only': 'O status deve ser pendente, confirmada ou cancelada'
      }),
      certificado_emitido: Joi.boolean().default(false).messages({
        'boolean.base': 'O campo certificado_emitido deve ser um booleano'
      })
    });
  }
}

module.exports = Inscriptions; 