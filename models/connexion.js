const mongoose = require("mongoose");
require("dotenv").config();

// Chargement de la chaîne de connexion depuis .env
const connectionString = process.env.CONNECTION_STRING;

console.log(connectionString);

// Vérification de la présence de la variable
if (!connectionString) {
  console.error("Database connection string is missing in .env file");
  process.exit(1); // Terminer l'application si la chaîne de connexion est absente
}

// Connexion à la base de données MongoDB
mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => {
    console.log("Database connected 🥳");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Terminer l'application si la connexion échoue
  });
