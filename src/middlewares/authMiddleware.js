const authMiddleware = {
    isAuthenticated(req, res, next) {
        if (req.session.user) {
            return next();
        }
        res.redirect('/auth/login');
    },

    isAdmin(req, res, next) {
        if (req.session.user && req.session.user.tipo_usuario === 'admin') {
            return next();
        }
        res.status(403).json({ error: 'Acesso negado' });
    },

    isOrganizer(req, res, next) {
        if (req.session.user && 
            (req.session.user.tipo_usuario === 'admin' || 
             req.session.user.tipo_usuario === 'organizador')) {
            return next();
        }
        res.status(403).json({ error: 'Acesso negado' });
    }
};

module.exports = authMiddleware; 