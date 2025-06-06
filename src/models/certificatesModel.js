const Joi = require('joi');

class Certificates {
  static get schema() {
    return Joi.object({
      id_inscricao: Joi.number().integer().required(),
      caminho_arquivo: Joi.string().required(),
      data_emissao: Joi.date().required()
    });
  }
}

module.exports = Certificates;
