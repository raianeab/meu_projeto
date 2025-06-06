const express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');
const usersController = require('../controllers/usersController');

// Rota para renderizar a página de usuários
router.get('/', usersController.list);

// Rotas da API
router.post('/api', usersController.create);
router.get('/api', usersController.findAll);
router.get('/api/:id', usersController.findById);
router.put('/api/:id', usersController.update);
router.delete('/api/:id', usersController.delete);

module.exports = router;