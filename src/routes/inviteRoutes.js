const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/convites', authMiddleware.isAuthenticated, authMiddleware.isAdmin, inviteController.showInvites);

// abrir página de aceite de convite
// router.get('/convite/:token', inviteController.showAcceptInvite);


router.get('/convite/:token', inviteController.showAcceptInvite);


// enviar nome + senha
router.post('/convite/definir-senha', inviteController.acceptInvite);



module.exports = router;
