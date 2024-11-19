const mongoose = require("mongoose");

// Définition du schéma pour le modèle "Post"
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // La description de l'article
    description: {
      type: String,
      required: true,
    },

    // Le chemin de l'image associée à l'article
    imagePath: {
      type: [String],
      required: true,
      default: "https://example.com/default-image.jpg",
    },
    category: {
      type: String,
      default: "uncategorized",
    },

    // L'utilisateur qui a créé ce post (référence à un document User)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // La référence est vers le modèle "User"
    },

    tags: [String],

    // Liste des utilisateurs ayant aimé ce post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Liste des commentaires associés au post
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },

  { timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
