const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extraire le token du header
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, token manquant'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'residanat2025secret');

    // Ajouter l'utilisateur à la requête
    req.user = await User.findByPk(decoded.id);

    // Vérifier si l'utilisateur existe
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'email est vérifié
    if (!req.user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre email pour accéder à cette ressource'
      });
    }

    next();
  } catch (error) {
    console.error(`Erreur d'authentification: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, token invalide'
    });
  }
};
