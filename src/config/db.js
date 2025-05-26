const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Créer le répertoire data s'il n'existe pas
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Chemin vers la base de données SQLite
const dbPath = path.join(dataDir, 'residanat.sqlite');

// Initialisation de Sequelize avec SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false // Mettre à true pour voir les requêtes SQL dans la console
});

// Fonction pour connecter à la base de données
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données SQLite établie avec succès');
    
    // Synchroniser les modèles avec la base de données
    // force: true va supprimer et recréer les tables (à utiliser avec précaution)
    await sequelize.sync({ force: true }); // Modifié pour forcer la création des tables
    console.log('Modèles synchronisés avec la base de données');
    
    return true;
  } catch (error) {
    console.error(`Erreur de connexion à la base de données: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
