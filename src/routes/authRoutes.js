const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para renderizar a página de login
router.get('/login', (req, res) => {
    res.render('pages/login', { error: null });
});

// Rota para renderizar a página de registro
router.get('/register', (req, res) => {
    res.render('pages/register', { error: null });
});

// Rotas da API
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/check', authController.checkAuth);

module.exports = router;
