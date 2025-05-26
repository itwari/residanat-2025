const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password'
  }
});

// Fonction pour envoyer un email de vérification
const sendVerificationEmail = async (options) => {
  try {
    const message = {
      from: `${process.env.EMAIL_FROM || 'Résidanat 2025'} <${process.env.EMAIL_USER || 'test@example.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log(`Email envoyé: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Erreur d'envoi d'email: ${error.message}`);
    return false;
  }
};

module.exports = { sendVerificationEmail };
