const Joi = require('joi');

class Categories {
  static get schema() {
    return Joi.object({
      nome_categoria: Joi.string().max(100).required(),
      descricao: Joi.string().allow('').required()
    });
  }
}

module.exports = Categories;
