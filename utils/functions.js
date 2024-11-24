exports.getImageFromUnsplash = async (keywords) => {
  const query = keywords.join(" "); // Joindre les mots-clés en une seule chaîne
  const apiKey = process.env.UNSPLASH_API_KEY; // Récupérer la clé API depuis les variables d'environnement
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&client_id=${apiKey}&per_page=50`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Vérifie s'il y a des résultats et retourne une liste d'URLs d'images
    if (data.results && data.results.length > 0) {
      return data.results.map((result) => result.urls.small); // Retourne les petites images
    }

    // Retourne une image par défaut si aucune image n'est trouvée
    return ["https://example.com/default-image.jpg"];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'image depuis Unsplash:",
      error
    );
    return ["https://example.com/default-image.jpg"]; // URL par défaut en cas d'erreur
  }
};
