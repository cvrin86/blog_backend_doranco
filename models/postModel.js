const mongoose = require("mongoose");

// Définition du schéma pour le modèle "Post"
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    imagePath: {
      type: [String],
      required: true,
      default: "https://example.com/default-image.jpg",
    },
    category: {
      type: String,
      default: "uncategorized",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // La référence est vers le modèle "User"
    },

    tags: [String],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
