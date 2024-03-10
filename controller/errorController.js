exports.get404 = (req, res) => {
  res.render("404", {
    pageTitle: "404",
    path: "404",
    fullName: req.user.fullName,
    userImageProfile: req.user.userImageProfile,
  });
};

exports.get500 = (req, res) => {
  res.render("500", {
    pageTitle: "500",
    path: "500",
    fullName: req.user.fullName,
    userImageProfile: req.user.userImageProfile,
  });
};
