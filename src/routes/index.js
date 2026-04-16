const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
  res.send('API do power bi funcionando!');
});

const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);




module.exports = router; 