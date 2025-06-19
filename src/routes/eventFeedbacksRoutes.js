const express = require('express');
const router = express.Router();
const eventFeedbacksController = require('../controllers/eventFeedbacksController');

router.get('/', eventFeedbacksController.renderFeedbackPage);

router.get('/list', eventFeedbacksController.list);

router.post('/', eventFeedbacksController.create);
router.get('/', eventFeedbacksController.findAll);
router.get('/:id', eventFeedbacksController.findById);
router.put('/:id', eventFeedbacksController.update);
router.delete('/:id', eventFeedbacksController.delete);

module.exports = router; 