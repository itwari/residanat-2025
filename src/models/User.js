const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

// Définition du modèle User avec Sequelize
const User = sequelize.define('User', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le nom est obligatoire' }
    }
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le prénom est obligatoire' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Veuillez fournir une adresse email valide' },
      notEmpty: { msg: "L'adresse email est obligatoire" }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [8, 100], msg: 'Le mot de passe doit contenir au moins 8 caractères' },
      notEmpty: { msg: 'Le mot de passe est obligatoire' }
    }
  },
  filiere: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['medecine', 'pharmacie', 'dentaire']],
        msg: 'La filière doit être medecine, pharmacie ou dentaire'
      },
      notEmpty: { msg: 'La filière est obligatoire' }
    }
  },
  dateNaissance: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La date de naissance est obligatoire' }
    }
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le numéro de téléphone est obligatoire' }
    }
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationCode: {
    type: DataTypes.STRING
  },
  verificationCodeExpires: {
    type: DataTypes.DATE
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true, // Active createdAt et updatedAt
  hooks: {
    // Hook pour hasher le mot de passe avant la création ou la mise à jour
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Méthode pour comparer les mots de passe
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un code de vérification
User.prototype.generateVerificationCode = function() {
  // Générer un code à 6 chiffres
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Définir le code et sa date d'expiration (1 heure)
  this.verificationCode = verificationCode;
  this.verificationCodeExpires = new Date(Date.now() + 3600000); // 1 heure
  
  return verificationCode;
};

module.exports = User;
