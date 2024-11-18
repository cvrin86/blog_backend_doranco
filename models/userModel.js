const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"], // Correction ici : required avec un message
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Correction ici : required avec un message
      unique: true,
    },
    password: {
      type: String, // Corrigé : 'type' au lieu de 'email'
      required: [true, "Password is required"], // Correction ici : required avec un message
    },
    profil_picture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2016/04/01/12/11/avatar-1300582_1280.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Conventionnellement, on utilise 'User' au singulier

module.exports = User;
