const express = require('express');
const router = express.Router();
const Events = require('../models/eventsModel');
const eventsController = require('../controllers/eventsController');

// Rota para renderizar a página de eventos
router.get('/', eventsController.list);

// Rotas da API
router.post('/api', eventsController.create);
router.get('/api', eventsController.findAll);
router.get('/api/:id', eventsController.findById);
router.put('/api/:id', eventsController.update);
router.delete('/api/:id', eventsController.delete);

module.exports = router;