const express = require('express');
const router = express.Router();
const certificatesController = require('../controllers/certificatesController');

router.get('/', certificatesController.index);
router.post('/', certificatesController.create);

module.exports = router;