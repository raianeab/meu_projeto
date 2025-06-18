const express = require('express');
const router = express.Router();
const Events = require('../models/eventsModel');
const eventsController = require('../controllers/eventsController');

// Rota para renderizar a página de eventos
router.get('/', eventsController.list);

// Rotas da API
router.post('/', eventsController.create);
router.get('/', eventsController.findAll);
router.get('/:id', eventsController.findById);
router.put('/:id', eventsController.update);
router.delete('/:id', eventsController.delete);

module.exports = router;