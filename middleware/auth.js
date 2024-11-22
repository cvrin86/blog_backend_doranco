const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // Récupération du token JWT depuis les cookies
  const token = req.cookies.jwt;
  console.log("Token reçu:", token);

  // Vérification de l'existence du token
  if (!token) {
    return res.status(401).json({ error: "Utilisateur non autorisé." });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Utilisateur décodé:", req.user);

    // Passage à la prochaine middleware/route
    next();
  } catch (error) {
    // Gestion des erreurs en cas de token invalide
    console.error("Erreur de vérification du token:", error);
    return res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = { auth };
