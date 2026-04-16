const Joi = require('joi');

class Lead {
  static get schema() {
    return Joi.object({
      nome:         Joi.string().trim().min(2).max(150).required()
                      .messages({ 'any.required': 'Nome completo é obrigatório.' }),
      nome_empresa: Joi.string().trim().min(2).max(150).required()
                      .messages({ 'any.required': 'Nome da empresa é obrigatório.' }),
      email:        Joi.string().trim().email({ tlds: { allow: false } }).max(254).required()
                      .messages({
                        'string.email':   'Informe um e-mail corporativo válido.',
                        'any.required':   'E-mail é obrigatório.',
                      }),
      turnstileToken: Joi.string().required()
                        .messages({ 'any.required': 'Token de verificação ausente.' }),
    });
  }
}

module.exports = Lead;
