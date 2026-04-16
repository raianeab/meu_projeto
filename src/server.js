require("dotenv").config();
const express = require("express");
const path = require('path'); // para lidar com caminhos de arquivos
const session = require('express-session');
const flash = require('connect-flash');
const supabase = require('./config/db');
const app = express();
const authRoutes = require('./routes/authRoutes');



app.use(express.static(path.join(__dirname, 'public')));


// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
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
  if (req.session && req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('pages/landing', { turnstileSiteKey: process.env.TURNSTILE_SITE_KEY });
  }
});

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/', dashboardRoutes);

const inviteRoutes = require('./routes/inviteRoutes');
app.use('/', inviteRoutes);

const companyUsersRoutes = require('./routes/companyUsersRoutes');
app.use('/', companyUsersRoutes);

const dataRoutes = require('./routes/dataRoutes');
app.use('/', dataRoutes);

const leadsRoutes = require('./routes/leadsRoutes');
app.use('/api', leadsRoutes);

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
  if (req.path.startsWith('/api/')) {
    const status = err.status || 500;
    const message = status < 500 ? err.message : 'Erro interno do servidor';
    return res.status(status).json({ error: message });
  }
  res.status(500).render('pages/error', {
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

