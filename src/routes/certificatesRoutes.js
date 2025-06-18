const express = require('express');
const router = express.Router();
const certificatesController = require('../controllers/certificatesController');

// Rotas para renderização de páginas
router.get('/', certificatesController.list);

// Rotas da API
router.post('/api', certificatesController.create);
router.get('/api', certificatesController.findAll);
router.get('/api/:id', certificatesController.findById);
router.put('/api/:id', certificatesController.update);
router.delete('/api/:id', certificatesController.delete);

module.exports = router; 