require("dotenv").config();
const express = require("express");
const path = require('path'); // para lidar com caminhos de arquivos
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const usersRoutes = require('./routes/usersRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const certificatesRoutes = require('./routes/certificatesRoutes');
const inscriptionsRoutes = require('./routes/inscriptionsRoutes');
const eventCategoriesRoutes = require('./routes/eventCategoriesRoutes');
const eventFeedbacksRoutes = require('./routes/eventFeedbacksRoutes');
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

// Rota raiz - deve ser a primeira rota
app.get('/', HomeController.index);

// Rotas da API
app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/inscriptions', inscriptionsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/event-feedbacks', eventFeedbacksRoutes);

// Rotas das páginas
app.use('/events', eventsRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/inscriptions', inscriptionsRoutes);
app.use('/certificates', certificatesRoutes);
app.use('/event-feedbacks', eventFeedbacksRoutes);

// Rota de teste  
app.get('/test', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

// Middleware para tratamento de erros gerais
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

