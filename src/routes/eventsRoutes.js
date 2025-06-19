const express = require('express');
const router = express.Router();
const Events = require('../models/eventsModel');
const eventsController = require('../controllers/eventsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', eventsController.list);

router.post('/', authMiddleware.isOrganizer, eventsController.create);
router.get('/', eventsController.findAll);
router.get('/:id', eventsController.findById);
router.put('/:id', authMiddleware.isOrganizer, eventsController.update);
router.delete('/:id', authMiddleware.isOrganizer, eventsController.delete);

module.exports = router;