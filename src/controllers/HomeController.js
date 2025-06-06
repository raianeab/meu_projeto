// const db = require('../config/db');

const HomeController = {
    index(req, res) {
        res.render('pages/home', {
            eventos: [],
            categorias: [],
            eventosPorCategoria: {},
            user: null
        });
    }
};

module.exports = HomeController;