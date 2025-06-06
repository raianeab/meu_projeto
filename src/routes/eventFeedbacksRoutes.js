const express = require('express');
const router = express.Router();
const eventFeedbacksController = require('../controllers/eventFeedbacksController');

// Rota para a página de listagem de feedbacks (deve vir antes das rotas com parâmetros)
router.get('/list', eventFeedbacksController.list);

// Rotas da API
router.get('/', eventFeedbacksController.findAll);
router.get('/:id', eventFeedbacksController.findById);
router.put('/:id', eventFeedbacksController.update);
router.delete('/:id', eventFeedbacksController.delete);
router.post('/', eventFeedbacksController.create);

module.exports = router; 