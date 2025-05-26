const express = require('express');
const router = express.Router();
const inscriptionsController = require('../controllers/inscriptionsController');

router.get('/', inscriptionsController.index);
router.post('/', inscriptionsController.create);

module.exports = router; 