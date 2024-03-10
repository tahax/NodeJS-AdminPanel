const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../model/user");

exports.signin = (req, res, next) => {
  res.render("signin", {
    pageTitle: "ورود به پنل وبسمت",
    path: "signin",
    message: req.flash("success_msg"),
    error: req.flash("error"),
  });
};

exports.handleLogin = (req, res, next) => {
  passport.authenticate("local", {
    // successRedirect: "/adminpanel",
    failureRedirect: "/signinpanel",
    failureFlash: true,
  })(req, res, next);
};

exports.rememberMe = (req, res, next) => {
  if (req.body.remember) {
    req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000;
  } else {
    req.session.cookie.expire = null;
  }
  res.redirect("/adminpanel");
};

exports.logout = function (req, res, next) {
  req.session = null;
  req.logout();
  // req.flash("success_msg", "خروج موفقیت امیز بود");
  res.redirect("/signinpanel");
};

exports.signup = (req, res, next) => {
  res.render("signup", { pageTitle: "ثبت نام", path: "signup" });
};

exports.createUser = async (req, res, next) => {
  const errors = [];
  try {
    await User.userValidation(req.body);
    const { fullName, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ message: "کاربری با این ایمیل موجود است" });
      return res.render("signup", {
        pageTitle: "ثبت نام کاربر",
        path: "signup",
        errors,
      });
    } else {
      // const hash = await bcrypt.hash(password, 10);
      // await User.create({ fullName, email, password: hash });
      await User.create({ fullName, email, password });
      req.flash("success_msg", "ثبت نام موفقیت آمیز بود");
      res.redirect("/signinpanel");
    }
  } catch (err) {
    console.log(err);

    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });

    return res.render("signup", {
      pageTitle: "ثبت نام ",
      path: "signup",
      errors,
    });
  }
};

exports.editUserName = async (req, res, next) => {
  const errors = [];
  try {
    await User.editUserFullNameValidation(req.body);
    const user = await User.findOne({ _id: req.user.id });
    console.log(user);
    console.log(req.body);
    if (user) {
      const { fullName } = req.body;
      user.fullName = fullName;
      await user.save();
      req.flash("success_msg", "تغییرات با موفقیت انجام شد");
      res.redirect("/profile");
    }
  } catch (err) {
    console.log(err);

    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });

    return res.render("profile", {
      pageTitle: "پروفایل ",
      path: "profile",
      errors,
    });
  }
};

exports.editPassword = async (req, res, next) => {
  const errors = [];
  try {
    await User.editUserPasswordValidation(req.body);
    const user = await User.findOne({ _id: req.user.id });
    if (user) {
      const { password } = req.body;
      if (password.length <= 0) {
      }
      user.password = password;
      await user.save();
      req.flash("success_msg", "تغییرات با موفقیت انجام شد");
      res.redirect("/logout");
    }
  } catch (err) {
    console.log(err);

    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });

    return res.render("profile", {
      pageTitle: "پروفایل ",
      path: "profile",
      errors,
    });
  }
};
