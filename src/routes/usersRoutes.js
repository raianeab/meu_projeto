const express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');
const usersController = require('../controllers/usersController');

// Rota para renderizar a página de usuários
router.get('/', usersController.list);

// Rotas da API
router.get('/', usersController.findAll);
router.get('/:id', usersController.findById);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;