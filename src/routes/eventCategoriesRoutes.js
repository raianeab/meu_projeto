const express = require('express');
const router = express.Router();
const EventCategories = require('../models/eventCategoriesModel');
const eventCategoriesController = require('../controllers/eventCategoriesController');

router.post('/', eventCategoriesController.create);
router.get('/', eventCategoriesController.findAll);
router.get('/:id', eventCategoriesController.findById);
router.put('/:id', eventCategoriesController.update);
router.delete('/:id', eventCategoriesController.delete);

module.exports = router; 