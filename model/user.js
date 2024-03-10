const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const {
  schema,
  editFullNameSchema,
  editPasswordSchema,
} = require("./secure/uservalidation");

const userSchema = new mongoose.Schema({
  userImageProfile: {
    type: String,
    default: "http://localhost:3000/img/undraw_profile.svg",
  },
  fullName: {
    type: String,
    required: [true, "نام و نام خانوادگی الزامیست"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.statics.userValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

userSchema.statics.editUserFullNameValidation = function (body) {
  return editFullNameSchema.validate(body, { abortEarly: false });
};

userSchema.statics.editUserPasswordValidation = function (body) {
  return editPasswordSchema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("User", userSchema);
