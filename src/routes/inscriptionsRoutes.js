const express = require('express');
const router = express.Router();
const inscriptionsController = require('../controllers/inscriptionsController');

// Rota para renderizar a página de inscrições
router.get('/list', inscriptionsController.list);

// Rotas da API
router.get('/', inscriptionsController.findAll);
router.get('/:id', inscriptionsController.findById);
router.put('/:id', inscriptionsController.update);
router.delete('/:id', inscriptionsController.delete);
router.post('/', inscriptionsController.create);

module.exports = router; 