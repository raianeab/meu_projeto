require("dotenv").config();
const express = require("express");
const app = express();
const usersRoutes = require('./routes/usersRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const certificatesRoutes = require('./routes/certificatesRoutes');
const inscriptionsRoutes = require('./routes/inscriptionsRoutes');
const eventCategoriesRoutes = require('./routes/eventCategoriesRoutes');
const eventFeedbacksRoutes = require('./routes/eventFeedbacksRoutes');
app.use(express.json());

// Adiciona logs para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Registra as rotas
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/events', eventsRoutes);
app.use('/certificates', certificatesRoutes);
app.use('/inscriptions', inscriptionsRoutes);
app.use('/event-categories', eventCategoriesRoutes);
app.use('/event-feedbacks', eventFeedbacksRoutes);

// Rota de teste  
app.get('/test', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});