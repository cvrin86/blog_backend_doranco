const Post = require("../models/postModel");
const { isValidObjectId } = require("mongoose");
const { getImageFromUnsplash } = require("../utils/functions.js");

// Contrôleur pour créer un post
exports.createPost = async (req, res) => {
  try {
    const { title, description, category, tags, selectedImage } = req.body;
    // console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ result: false, error: "Not Authorized" });
    }

    const keywords =
      tags && tags.length > 0
        ? tags.split(",").map((tag) => tag.trim())
        : [title];

    const imagePaths = selectedImage
      ? [selectedImage]
      : await getImageFromUnsplash(keywords);

    const newPost = new Post({
      title,
      description,
      category,
      imagePath: imagePaths,
      tags,
      author: req.user.id,
    });

    // Sauvegarde du post dans la base de données
    const savedPost = await newPost.save();

    res.status(201).json({ message: "Post créé", savedPost });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    // Paramètres de pagination
    const startIndex = parseInt(req.query.startIndex) || 0; // Point de départ
    const limit = parseInt(req.query.limit) || 15; // Nombre d'articles à récupérer
    const sortDirection = req.query.order === "asc" ? 1 : -1; // Tri par date de mise à jour

    // Recherche des articles, avec peuplement de l'auteur
    const posts = await Post.find()
      .populate("author", "username") // Peupler le champ 'author' avec uniquement le champ 'username' de l'utilisateur
      .sort({ updatedAt: sortDirection }) // Trier par la date de mise à jour
      .skip(startIndex) // Sauter les articles déjà récupérés pour la pagination
      .limit(limit); // Limiter le nombre d'articles récupérés

    // Retourner les articles avec l'auteur peuplé
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des posts" });
  }
};

// Fonction pour récupérer les posts de l'utilisateur connecté
exports.getPostsUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const startIndex = parseInt(req.query.startIndex) || 0;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Recherche des articles de l'utilisateur connecté
    const posts = await Post.find({ author: userId })
      .populate("author", "username")
      .sort({ updatedAt: sortDirection })
      .skip(startIndex);

    // Retourner les articles avec l'auteur peuplé
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
    // console.log(id);
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

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("idUpdate :", id);
    const { title, description, tags, selectedImage } = req.body;

    // Mise à jour du post avec vérification de l'auteur directement
    const updates = {
      ...(title && { title }),
      ...(description && { description }),
      ...(tags && { tags: tags.split(",").map((tag) => tag.trim()) }),
      ...(selectedImage && { imagePath: [selectedImage] }),
    };

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, author: req.user._id }, // Filtre par ID et auteur
      updates,
      { new: true } // Retourne le post mis à jour
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Post introuvable ou non autorisé" });
    }

    res.status(200).json({ message: "Post mis à jour", updatedPost });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    console.log("Suppression du post :", { postId, userId });

    // Rechercher le post
    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post introuvable");
      return res.status(404).json({ message: "Post introuvable" });
    }

    // Vérifier l'auteur
    if (!post.author) {
      console.error("Champ 'author' manquant dans le post :", post);
      return res
        .status(500)
        .json({ message: "Données invalides dans le post" });
    }

    if (post.author.toString() !== userId) {
      console.log("Utilisateur non autorisé");
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
    }

    // Supprimer le post
    await Post.findByIdAndDelete(postId);
    console.log("Post supprimé avec succès !");
    res.status(200).json({ message: "Le post a été supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

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
