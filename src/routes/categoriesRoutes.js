const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

router.get('/', categoriesController.index);
router.post('/', categoriesController.create);

module.exports = router;