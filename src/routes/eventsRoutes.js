const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.index);
router.post('/', eventsController.create);

module.exports = router;