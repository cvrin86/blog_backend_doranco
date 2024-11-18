// Import des modules nécessaires
require("dotenv").config(); // Charger les variables d'environnement
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const usersRouter = require("./routes/usersRoutes");

const app = express();
const PORT = process.env.PORT || 5000; // Utilisation de la variable d'environnement ou par défaut 5000

// Middleware pour autoriser les requêtes CORS et parser le corps des requêtes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de données MongoDB
const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  console.error("Database connection string is missing in .env file");
  process.exit(1); // Terminer l'application si la chaîne de connexion est absente
}

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected 🥳"))
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Terminer l'application si la connexion échoue
  });

// // Route d'exemple
// app.get("/", (req, res) => {
//   res.send("Hello, world! Server is running!");
// });

app.use("/users", usersRouter);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
