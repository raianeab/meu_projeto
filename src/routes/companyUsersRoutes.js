const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controllers/usersCompanyController');


router.get(
    '/usuarios',
    authMiddleware.isAuthenticated,
    authMiddleware.isAdmin,
    controller.index
);

router.post(
    '/usuarios/convidar',
    authMiddleware.isAuthenticated,
    authMiddleware.isAdmin,
    controller.invite
);

router.post(
    '/usuarios/:id/desativar',
    authMiddleware.isAuthenticated,
    authMiddleware.isAdmin,
    controller.deactivate
);

router.post(
    '/usuarios/:id/ativar',
    authMiddleware.isAuthenticated,
    authMiddleware.isAdmin,
    controller.activate
);

module.exports = router;
