const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');

// abrir página de aceite de convite
// router.get('/convite/:token', inviteController.showAcceptInvite);


router.get('/convite/:token', (req, res, next) => {
    console.log('ROTA DE CONVITE ACESSADA');
    next();
}, inviteController.showAcceptInvite);


// enviar nome + senha
router.post('/convite/definir-senha', inviteController.acceptInvite);



module.exports = router;
