const express = require('express');
const router = express.Router();
const Categories = require('../models/categoriesModel');
const categoriesController = require('../controllers/categoriesController');

router.post('/', categoriesController.create);
router.get('/', categoriesController.findAll);

router.get('/list', categoriesController.list);

router.get('/:id', categoriesController.findById);
router.put('/:id', categoriesController.update);
router.delete('/:id', categoriesController.delete);

module.exports = router;