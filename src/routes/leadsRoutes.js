const express = require('express');
const { rateLimit } = require('express-rate-limit');
const leadsController = require('../controllers/leadsController');

const router = express.Router();

const leadsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Tente novamente em 1 hora.' },
});

router.post('/leads', leadsLimiter, leadsController.create);

module.exports = router;
