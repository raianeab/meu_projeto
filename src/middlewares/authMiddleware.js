const authMiddleware = {
    // Middleware para verificar se o usuário está autenticado
    isAuthenticated(req, res, next) {
        if (req.session.user) {
            return next();
        }
        res.redirect('/auth/login');
    },

    // Middleware para verificar se o usuário é admin
    isAdmin(req, res, next) {
        if (req.session.user && req.session.user.tipo_usuario === 'admin') {
            return next();
        }
        res.status(403).json({ error: 'Acesso negado' });
    },

    // Middleware para verificar se o usuário é organizador
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