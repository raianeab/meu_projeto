const express = require('express');
const router = express.Router();
const Categories = require('../models/categoriesModel');
const categoriesController = require('../controllers/categoriesController');

// Rotas da API
router.post('/', categoriesController.create);
router.get('/', categoriesController.findAll);

// Rota para a página de listagem de categorias (deve vir antes da rota com parâmetro)
router.get('/list', categoriesController.list);

// Rotas com parâmetros
router.get('/:id', categoriesController.findById);
router.put('/:id', categoriesController.update);
router.delete('/:id', categoriesController.delete);

module.exports = router;