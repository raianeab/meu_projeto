const express = require('express');
const router = express.Router();
const eventCategoriesController = require('../controllers/eventCategoriesController');

router.get('/', eventCategoriesController.index);
router.post('/', eventCategoriesController.create);

module.exports = router; 