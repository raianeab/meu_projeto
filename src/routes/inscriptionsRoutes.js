const express = require('express');
const router = express.Router();
const inscriptionsController = require('../controllers/inscriptionsController');

router.get('/list', inscriptionsController.list);

router.get('/', inscriptionsController.findAll);
router.get('/:id', inscriptionsController.findById);
router.put('/:id', inscriptionsController.update);
router.delete('/:id', inscriptionsController.delete);
router.post('/', inscriptionsController.create);

module.exports = router; 