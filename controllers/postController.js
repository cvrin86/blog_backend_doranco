const Post = require("../models/postModel");
const { isValidObjectId } = require("mongoose");
const { getImageFromUnsplash } = require("../utils/functions.js");

// Contrôleur pour créer un post
exports.createPost = async (req, res) => {
  try {
    const { title, description, tags, selectedImage } = req.body;

    // Si les tags sont envoyés sous forme d'une chaîne séparée par des virgules, on les transforme en tableau
    const keywords =
      tags && tags.length > 0
        ? tags.split(",").map((tag) => tag.trim())
        : [title];

    // Si une image a été sélectionnée, on l'utilise. Sinon, on récupère les images depuis Unsplash
    const imagePaths = selectedImage
      ? [selectedImage]
      : await getImageFromUnsplash(keywords);

    // Crée un nouvel objet Post avec l'image récupérée
    const newPost = new Post({
      title,
      description,
      imagePath: imagePaths,
      tags,
      // createdBy: req.user._id, // Si tu as un système d'utilisateur authentifié
    });

    // Sauvegarde le post dans la base de données
    const savedPost = await newPost.save();

    res.status(201).json({ message: "Post créé", savedPost });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({})
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des posts" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    res.json({ posts: [post] }); // Retourner l'objet post dans un tableau
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

// Dans le contrôleur
exports.getImages = async (req, res) => {
  const { tags } = req.query; // Récupérer les tags de la requête

  if (!tags || tags.trim().length === 0) {
    return res.status(400).json({
      message: "Veuillez fournir des mots-clés pour rechercher des images.",
    });
  }

  try {
    const keywords = tags.split(",").map((tag) => tag.trim());
    const imagePaths = await getImageFromUnsplash(keywords);

    if (imagePaths.length === 0) {
      return res.status(404).json({ message: "Aucune image trouvée." });
    }

    res.status(200).json({ imagePaths });
  } catch (error) {
    console.error("Erreur lors de la recherche des images", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
