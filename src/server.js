const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Initialiser l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: false }));

// Middleware CORS - Configuration pour permettre les requêtes du frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Autorise les requêtes du frontend ou de toutes les origines en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Définir les routes API
app.use('/api/auth', require('./routes/auth'));

// Route de base pour l'API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API Concours d\'accès au résidanat Session Octobre 2025',
    institution: 'Faculté de médecine d\'Oran université d\'Oran 1 "AHMED Benbela"',
    status: 'En ligne',
    version: '1.0.0'
  });
});

// Gestion des erreurs 404 pour les routes API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route API non trouvée'
  });
});

// Réponse pour toutes les autres routes non-API
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Cette route n\'existe pas. Veuillez utiliser les endpoints API.'
  });
});

// Port d'écoute
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur API démarré sur le port ${PORT}`);
});

module.exports = app;
