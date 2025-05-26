# Application d'inscription au concours Résidanat 2025

Cette application permet aux candidats de s'inscrire au concours national de Résidanat en Algérie pour les trois filières : médecine, pharmacie et médecine dentaire.

## Fonctionnalités

- Inscription des candidats avec sélection de filière
- Vérification d'email
- Connexion sécurisée
- Tableau de bord personnalisé
- Protection par CAPTCHA
- Interface responsive pour mobile et desktop

## Prérequis

- Node.js v14+ et npm

## Installation

1. Clonez ce dépôt sur votre machine locale
2. Installez les dépendances du backend :
   ```
   cd residanat-inscription-app
   npm install
   ```
3. Installez les dépendances du frontend :
   ```
   cd client
   npm install
   ```
4. Configurez les variables d'environnement en modifiant le fichier `.env` à la racine du projet

## Configuration

Modifiez le fichier `.env` avec vos propres paramètres :

```
PORT=5000
JWT_SECRET=votre_secret_jwt
EMAIL_SERVICE=votre_service_email
EMAIL_USER=votre_email
EMAIL_PASSWORD=votre_mot_de_passe_email
EMAIL_FROM=Résidanat 2025
```

## Base de données

Cette application utilise SQLite comme base de données, ce qui simplifie considérablement l'installation et la configuration. La base de données sera automatiquement créée dans le dossier `data` à la racine du projet lors du premier démarrage.

## Démarrage

### Mode développement

1. Démarrez le serveur backend :
   ```
   npm run dev
   ```
2. Dans un autre terminal, démarrez le client React :
   ```
   cd client
   npm start
   ```

### Mode production

1. Construisez le frontend :
   ```
   cd client
   npm run build
   ```
2. Copiez le contenu du dossier `client/build` dans le dossier `public` du backend
3. Démarrez le serveur :
   ```
   npm start
   ```

L'application sera accessible à l'adresse http://localhost:5000

## Structure du projet

- `/src` : Code source du backend (Node.js/Express)
  - `/config` : Configuration de la base de données SQLite
  - `/controllers` : Contrôleurs pour gérer les requêtes
  - `/middleware` : Middleware d'authentification
  - `/models` : Modèles de données Sequelize
  - `/routes` : Routes API
  - `/utils` : Utilitaires (service d'email, etc.)
- `/client` : Code source du frontend (React)
- `/public` : Fichiers statiques servis par le backend
- `/data` : Dossier contenant la base de données SQLite

## Support

Pour toute question ou assistance, veuillez contacter l'administrateur du concours Résidanat 2025.



## Simulation de données

Ce projet inclut une base de données SQLite pré-remplie avec 20 utilisateurs fictifs pour faciliter les tests et la démonstration.

- La base de données se trouve dans le dossier `/data/residanat.sqlite`.
- Le script `seed.js` à la racine du projet permet de générer et d'insérer ces données fictives. **Attention : l'exécution de ce script effacera les données existantes avant d'insérer les nouvelles.**
- Pour réinitialiser la base de données avec de nouvelles données fictives, exécutez la commande suivante à la racine du projet :
  ```
  node seed.js
  ```
- Le script `verify_seed.js` permet de vérifier le contenu de la base de données après le seeding.

