const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', (req, res) => {
  res.send('API de Eventos funcionando!');
});

// Rotas de autenticação
const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

// Middleware de autenticação para rotas protegidas (COMENTADO)
// router.use(authMiddleware.isAuthenticated);

// Rotas protegidas (SEM AUTENTICAÇÃO)
const categoriesRoutes = require('./categoriesRoutes');
router.use('/api/categories', categoriesRoutes);

const usersRoutes = require('./usersRoutes');
router.use('/api/users', usersRoutes);

const eventsRoutes = require('./eventsRoutes');
router.use('/api/events', eventsRoutes);

const inscriptionsRoutes = require('./inscriptionsRoutes');
router.use('/api/inscriptions', inscriptionsRoutes);

const eventCategoriesRoutes = require('./eventCategoriesRoutes');
router.use('/api/event-categories', eventCategoriesRoutes);

const eventFeedbacksRoutes = require('./eventFeedbacksRoutes');
router.use('/api/event-feedbacks', eventFeedbacksRoutes);

const certificatesRoutes = require('./certificatesRoutes');
router.use('/api/certificates', certificatesRoutes);


module.exports = router; 