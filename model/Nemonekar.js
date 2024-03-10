const mongoose = require("mongoose");

const { schema } = require("./secure/nemonekarValidation");

const nemonekarSchema = new mongoose.Schema({
  deskImage: {
    type: String,
    required: true,
  },
  phoneImage: {
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

nemonekarSchema.statics.nemonekarValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Nemonekar", nemonekarSchema);
