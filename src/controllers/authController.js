const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { nom, prenom, email, password, filiere, dateNaissance, telephone } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Un utilisateur avec cette adresse email existe déjà' 
      });
    }

    // Créer un nouvel utilisateur
    user = await User.create({
      nom,
      prenom,
      email,
      password,
      filiere,
      dateNaissance,
      telephone
    });

    // Générer un code de vérification
    const verificationCode = user.generateVerificationCode();

    // Enregistrer le code de vérification
    await user.save();

    // Envoyer l'email de vérification
    const emailSent = await sendVerificationEmail({
      email: user.email,
      subject: 'Vérification de votre compte - Résidanat 2025',
      html: `
        <h1>Bienvenue au Concours Résidanat 2025</h1>
        <p>Bonjour ${user.prenom} ${user.nom},</p>
        <p>Merci de vous être inscrit au concours national de Résidanat 2025 en Algérie.</p>
        <p>Votre code de vérification est: <strong>${verificationCode}</strong></p>
        <p>Ce code est valable pendant 1 heure.</p>
        <p>Veuillez saisir ce code sur la page de vérification pour activer votre compte.</p>
        <p>Cordialement,<br>L'équipe du Concours Résidanat 2025</p>
      `
    });

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "L'inscription a réussi mais l'envoi de l'email de vérification a échoué. Veuillez contacter l'administrateur."
      });
    }

    // Créer un token JWT (sans les informations sensibles)
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'residanat2025secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        filiere: user.filiere,
        emailVerified: user.emailVerified
      },
      message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.'
    });
  } catch (error) {
    console.error(`Erreur d'inscription: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// @desc    Vérifier l'email avec le code
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Trouver l'utilisateur par email et code de vérification
    const user = await User.findOne({ 
      where: { 
        email,
        verificationCode,
        verificationCodeExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Code de vérification invalide ou expiré'
      });
    }

    // Mettre à jour le statut de vérification
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // Créer un token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'residanat2025secret',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        filiere: user.filiere,
        emailVerified: user.emailVerified
      },
      message: 'Vérification de l\'email réussie. Votre compte est maintenant actif.'
    });
  } catch (error) {
    console.error(`Erreur de vérification d'email: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification de l\'email'
    });
  }
};

// @desc    Renvoyer le code de vérification
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà vérifié'
      });
    }

    // Générer un nouveau code de vérification
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Envoyer l'email de vérification
    const emailSent = await sendVerificationEmail({
      email: user.email,
      subject: 'Nouveau code de vérification - Résidanat 2025',
      html: `
        <h1>Concours Résidanat 2025</h1>
        <p>Bonjour ${user.prenom} ${user.nom},</p>
        <p>Voici votre nouveau code de vérification: <strong>${verificationCode}</strong></p>
        <p>Ce code est valable pendant 1 heure.</p>
        <p>Veuillez saisir ce code sur la page de vérification pour activer votre compte.</p>
        <p>Cordialement,<br>L'équipe du Concours Résidanat 2025</p>
      `
    });

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "L'envoi de l'email de vérification a échoué. Veuillez réessayer plus tard."
      });
    }

    res.status(200).json({
      success: true,
      message: 'Un nouveau code de vérification a été envoyé à votre adresse email'
    });
  } catch (error) {
    console.error(`Erreur de renvoi de code: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du renvoi du code de vérification'
    });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si l'email est vérifié
    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre email avant de vous connecter',
        needsVerification: true,
        email: user.email
      });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'residanat2025secret',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        filiere: user.filiere,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error(`Erreur de connexion: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        filiere: user.filiere,
        dateNaissance: user.dateNaissance,
        telephone: user.telephone,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(`Erreur de récupération de profil: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du profil'
    });
  }
};
