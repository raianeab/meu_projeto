const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');

router.post('/leads', leadsController.create);

module.exports = router;
