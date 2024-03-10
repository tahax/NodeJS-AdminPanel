const mongoose = require("mongoose");

const postGallery = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("PostGallery", postGallery);
