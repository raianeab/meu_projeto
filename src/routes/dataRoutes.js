const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const dataController = require('../controllers/dataController');
const upload = require('../middlewares/uploadMiddleware');

router.get(
    '/dados',
    authMiddleware.isAuthenticated,
    dataController.index
);

router.post(
    '/dados/upload',
    authMiddleware.isAuthenticated,
    upload.single('arquivo'),
    (err, req, res, next) => {
        // Tratamento de erros do multer
        if (err) {
            req.flash('error', err.message || 'Erro ao fazer upload do arquivo');
            return res.redirect('/dados');
        }
        next();
    },
    dataController.upload
);

module.exports = router;
