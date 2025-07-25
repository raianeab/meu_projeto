require("dotenv").config();
const express = require("express");
const path = require('path'); // para lidar com caminhos de arquivos
const session = require('express-session');
const flash = require('connect-flash');
const supabase = require('./config/db');
const app = express();
const usersRoutes = require('./routes/usersRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const certificatesRoutes = require('./routes/certificatesRoutes');
const inscriptionsRoutes = require('./routes/inscriptionsRoutes');
const eventCategoriesRoutes = require('./routes/eventCategoriesRoutes');
const eventFeedbacksRoutes = require('./routes/eventFeedbacksRoutes');
const authRoutes = require('./routes/authRoutes');
const HomeController = require('./controllers/HomeController');


// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Adiciona logs para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rotas de autenticação (públicas)
app.use('/auth', authRoutes);

// Middleware de autenticação para rotas protegidas
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/home', isAuthenticated, HomeController.index);

app.use('/events', isAuthenticated, eventsRoutes);
app.use('/users', isAuthenticated, usersRoutes);
app.use('/categories', isAuthenticated, categoriesRoutes);
app.use('/inscriptions', isAuthenticated, inscriptionsRoutes);
app.use('/certificates', isAuthenticated, certificatesRoutes);
app.use('/event-feedbacks', isAuthenticated, eventFeedbacksRoutes);

app.use('/api/events', isAuthenticated, eventsRoutes);
app.use('/api/users', isAuthenticated, usersRoutes);
app.use('/api/categories', isAuthenticated, categoriesRoutes);
app.use('/api/inscriptions', isAuthenticated, inscriptionsRoutes);
app.use('/api/certificates', isAuthenticated, certificatesRoutes);
app.use('/api/event-feedbacks', isAuthenticated, eventFeedbacksRoutes);

app.use('/events/page', isAuthenticated, eventsRoutes);
app.use('/users/page', isAuthenticated, usersRoutes);
app.use('/categories/page', isAuthenticated, categoriesRoutes);
app.use('/inscriptions/page', isAuthenticated, inscriptionsRoutes);
app.use('/certificates/page', isAuthenticated, certificatesRoutes);
app.use('/event-feedbacks/page', isAuthenticated, eventFeedbacksRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

app.use((req, res, next) => {
  res.status(404).render('pages/error', {
    message: 'Página não encontrada',
    error: { status: 404 }
  });
});

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).render('pages/error', {
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

