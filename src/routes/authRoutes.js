const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', (req, res) => {
    res.render('pages/login', { error: null });
});

router.get('/register', (req, res) => {
    res.render('pages/register', { error: null });
});

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/check', authController.checkAuth);

module.exports = router;
