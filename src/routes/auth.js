const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { 
  register, 
  login, 
  verifyEmail, 
  resendVerification, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Route d'inscription
router.post(
  '/register',
  [
    check('nom', 'Le nom est obligatoire').not().isEmpty(),
    check('prenom', 'Le prénom est obligatoire').not().isEmpty(),
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('password', 'Le mot de passe doit contenir au moins 8 caractères').isLength({ min: 8 }),
    check('filiere', 'La filière est obligatoire').isIn(['medecine', 'pharmacie', 'dentaire']),
    check('dateNaissance', 'La date de naissance est obligatoire').not().isEmpty(),
    check('telephone', 'Le numéro de téléphone est obligatoire').not().isEmpty()
  ],
  register
);

// Route de connexion
router.post(
  '/login',
  [
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('password', 'Le mot de passe est obligatoire').exists()
  ],
  login
);

// Route de vérification d'email
router.post(
  '/verify-email',
  [
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('verificationCode', 'Le code de vérification est obligatoire').not().isEmpty()
  ],
  verifyEmail
);

// Route pour renvoyer le code de vérification
router.post(
  '/resend-verification',
  [
    check('email', 'Veuillez inclure un email valide').isEmail()
  ],
  resendVerification
);

// Route pour obtenir le profil utilisateur
router.get('/me', protect, getMe);

module.exports = router;
