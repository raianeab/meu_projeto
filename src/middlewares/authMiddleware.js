const authMiddleware = {

    // Usuário logado
    isAuthenticated(req, res, next) {
        if (req.session && req.session.user) {
            return next();
        }

        return res.redirect('/auth/login');
    },

    // Apenas ADMIN
    isAdmin(req, res, next) {
        if (
            req.session &&
            req.session.user &&
            req.session.user.role === 'admin'
        ) {
            return next();
        }

        return res.status(403).render('pages/error', {
            message: 'Acesso negado',
            error: { status: 403 }
        });
    },

    // ADMIN ou ORGANIZADOR
    isOrganizer(req, res, next) {
        if (
            req.session &&
            req.session.user &&
            ['admin', 'organizador'].includes(req.session.user.role)
        ) {
            return next();
        }

        return res.status(403).render('pages/error', {
            message: 'Acesso negado',
            error: { status: 403 }
        });
    }

};

module.exports = authMiddleware;
