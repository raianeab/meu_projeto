const express = require('express');
const router = express.Router();
const eventFeedbacksController = require('../controllers/eventFeedbacksController');

router.get('/', eventFeedbacksController.index);
router.post('/', eventFeedbacksController.create);

module.exports = router; 