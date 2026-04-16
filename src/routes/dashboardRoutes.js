// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middlewares/authMiddleware');
// const dashboardController = require('../controllers/dashboardController');
// const { getDashboardByUser } = require('../services/dashboardService');


// router.get(
//     'dashboard',
//     authMiddleware.isAuthenticated,
//     async (req, res, next) => {
//         const dashboard = await getDashboardByUser(req.session.user.id);

//         if (!dashboard) {
//             return res.status(403).send('Acesso não autorizado');
//         }

//         if (dashboard.companyId !== req.params.companyId) {
//             return res.status(403).send('Você não pode acessar este dashboard');
//         }

//         next();
//     },
//     dashboardController.index
// );


// module.exports = router;





const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.get(
    '/dashboard',
    authMiddleware.isAuthenticated,
    dashboardController.index
);

module.exports = router;

