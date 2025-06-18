const express = require('express');
const router = express.Router();
const eventFeedbacksController = require('../controllers/eventFeedbacksController');

// Rota para renderizar a página de feedback
router.get('/', eventFeedbacksController.renderFeedbackPage);

// Rota para a página de listagem de feedbacks (deve vir antes das rotas com parâmetros)
router.get('/list', eventFeedbacksController.list);

// Rotas da API
router.post('/', eventFeedbacksController.create);
router.get('/', eventFeedbacksController.findAll);
router.get('/:id', eventFeedbacksController.findById);
router.put('/:id', eventFeedbacksController.update);
router.delete('/:id', eventFeedbacksController.delete);

module.exports = router; 