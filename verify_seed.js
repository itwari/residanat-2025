const User = require("./src/models/User");
const { connectDB, sequelize } = require("./src/config/db");

const verifyData = async () => {
  try {
    // Connecter sans synchroniser/forcer la création
    await sequelize.authenticate();
    console.log("Connexion à la base de données SQLite établie pour vérification.");

    // Compter les utilisateurs
    const userCount = await User.count();
    console.log(`Nombre total d'utilisateurs dans la base: ${userCount}`);

    if (userCount === 0) {
      console.log("Aucun utilisateur trouvé. La base de données est vide.");
      return;
    }

    // Récupérer quelques utilisateurs pour vérification
    const sampleUsers = await User.findAll({ limit: 5 });
    console.log("\nExemples d'utilisateurs insérés:");
    sampleUsers.forEach((user, index) => {
      console.log(`--- Utilisateur ${index + 1} ---`);
      console.log(`  Nom: ${user.nom}`);
      console.log(`  Prénom: ${user.prenom}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Filière: ${user.filiere}`);
      console.log(`  Email Vérifié: ${user.emailVerified}`);
      console.log(`  Date Création: ${user.createdAt}`);
    });

    if (userCount === 20) {
        console.log("\nVérification réussie: Le nombre d'utilisateurs correspond à celui attendu (20).");
    } else {
        console.warn(`\nAvertissement: Le nombre d'utilisateurs (${userCount}) ne correspond pas à celui attendu (20).`);
    }

  } catch (error) {
    console.error("Erreur lors de la vérification des données:", error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
    console.log("\nConnexion à la base de données fermée.");
  }
};

// Exécuter la fonction de vérification
verifyData();

