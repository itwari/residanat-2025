const { faker } = require("@faker-js/faker/locale/fr");
const User = require("./src/models/User");
const { connectDB, sequelize } = require("./src/config/db");

const NB_USERS = 20; // Nombre d'utilisateurs à générer

const seedUsers = async () => {
  try {
    // Connexion et synchronisation de la base de données (force: true pour vider avant)
    await connectDB();
    console.log("Base de données connectée et synchronisée.");

    // Supprimer les utilisateurs existants
    await User.destroy({ where: {}, truncate: true });
    console.log("Utilisateurs existants supprimés.");

    const usersData = [];
    const filieres = ["medecine", "pharmacie", "dentaire"];

    for (let i = 0; i < NB_USERS; i++) {
      const nom = faker.person.lastName();
      const prenom = faker.person.firstName();
      const email = faker.internet.email({ firstName: prenom, lastName: nom }).toLowerCase();
      const password = "Password123"; // Mot de passe simple pour les tests, sera hashé par le hook
      const filiere = faker.helpers.arrayElement(filieres);
      const dateNaissance = faker.date.birthdate({ min: 18, max: 35, mode: "age" });
      const telephone = faker.phone.number("0[567]########");
      const emailVerified = faker.datatype.boolean(0.8); // 80% de chance d'être vérifié

      usersData.push({
        nom,
        prenom,
        email,
        password,
        filiere,
        dateNaissance,
        telephone,
        emailVerified,
      });
    }

    // Créer les utilisateurs en masse
    await User.bulkCreate(usersData);
    console.log(`${NB_USERS} utilisateurs fictifs ont été créés avec succès.`);

  } catch (error) {
    console.error("Erreur lors de la génération des données fictives:", error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
    console.log("Connexion à la base de données fermée.");
  }
};

// Exécuter la fonction de seeding
seedUsers();

