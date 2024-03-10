const fs = require("fs");
const path = require("path");

const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");

const Blog = require("../model/Blog");
const User = require("../model/user");
const Nemonekar = require("../model/Nemonekar");
const PostGallery = require("../model/PostGallery");
const NemonekarGallery = require("../model/NemonekarGallery");
const { formatDate } = require("../utils/jalali");
const { get500 } = require("./errorController");
const { fileFilter } = require("../utils/multer");

exports.getDashbord = async (req, res, next) => {
  const allBlogsModel = await Blog.find({});
  let allBlogs = 0;
  const userBlogsModel = await Blog.find({ user: req.user.id });
  let userBlogs = 0;
  const allNemonekarhaModel = await Nemonekar.find({});
  let allNemonekar = 0;
  const userNemonekarha = await Nemonekar.find({ user: req.user.id });
  let userNemonekar = 0;

  userBlogsModel.forEach((blog) => {
    userBlogs++;
  });
  allBlogsModel.forEach((allblog) => {
    allBlogs++;
  });
  userNemonekarha.forEach((nemonekarha) => {
    userNemonekar++;
  });
  allNemonekarhaModel.forEach((nemonekarha) => {
    allNemonekar++;
  });
  console.log(req.user.userImageProfile);
  res.render("panel", {
    pageTitle: " پنل مدیریت وبسمت",
    path: "panel",
    fullName: req.user.fullName,
    userImageProfile: req.user.userImageProfile,
    userBlogs,
    allBlogs,
    userNemonekar,
    allNemonekar,
  });
};

exports.getProfile = async (req, res, next) => {
  try {
    res.render("profile", {
      pageTitle: " مقالات",
      path: "profile",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getDashbordBlog = async (req, res, next) => {
  const page = +req.query.page || 1;
  const postPerPage = 8;
  try {
    const numberOfPosts = await Blog.find({
      user: req.user._id,
    }).countDocuments();
    const blogs = await Blog.find({ user: req.user.id })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    res.render("blog", {
      pageTitle: " مقالات",
      path: "blog",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      blogs,
      formatDate,
      currentPage: page,
      nextPage: page + 1,
      next2Page: page + 2,
      next3Page: page + 3,
      previousPage: page - 1,
      previous2Page: page - 2,
      previous3Page: page - 3,
      hasNextPage: postPerPage * page < numberOfPosts,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfPosts / postPerPage),
    });
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};

exports.getDashbordAddBlog = async (req, res, next) => {
  res.render("addblog", {
    pageTitle: "افزودن مقاله",
    path: "addblog",
    fullName: req.user.fullName,
    userImageProfile: req.user.userImageProfile,
  });
};

exports.getEditPost = async (req, res, next) => {
  const post = await Blog.findOne({ _id: req.params.id });
  if (!post) {
    return res.redirect("/404");
  }

  if (post.user.toString() !== req.user._id.toString()) {
    return res.redirect("/adminpanel");
  } else {
    res.render("editPost", {
      pageTitle: "ویرایش مقاله",
      path: "editPost",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      post,
    });
  }
};

exports.postEditPost = async (req, res, next) => {
  const post = await Blog.findOne({ _id: req.params.id });

  try {
    await Blog.postValidation(req.body);

    if (!post) {
      return res.redirect("/404");
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.redirect("/adminpanel");
    } else {
      const { image, title, status, body } = req.body;
      post.image = image;
      post.title = title;
      post.status = status;
      post.body = body;

      await post.save();
      return res.redirect("/blog");
    }
  } catch (err) {
    const errorArr = [];
    console.log(err);

    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });

    res.render("editPost", {
      pageTitle: "افزودن مقاله",
      path: "editPost",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      errors: errorArr,
      post,
    });
  }
};

exports.getDeletePost = async (req, res, next) => {
  try {
    const post = await Blog.findByIdAndRemove({ _id: req.params.id });
    console.log(post);
    res.redirect("/blog");
  } catch (err) {
    console.log(err);
    res.render("500");
  }
};

exports.postCreatBlog = async (req, res, next) => {
  try {
    await Blog.postValidation(req.body);
    await Blog.create({ ...req.body, user: req.user.id });
    res.redirect("/blog");
  } catch (err) {
    const errorArr = [];
    console.log(err);

    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });

    const images = [];

    res.render("addblog", {
      pageTitle: "افزودن مقاله",
      path: "addblog",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      errors: errorArr,
    });
  }
};

exports.uploadImageProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  const upload = multer({
    limits: { fileSize: 9000000 },
    // dest: "uploads/",
    // storage: storage,
    fileFilter: fileFilter,
  }).single("image");

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("حجم عکس نباید بیشتر 9 مگابایت باشد");
      }
      console.log("taha");
      console.log(err);
      res.status(400).send(err);
    } else {
      if (req.file) {
        const fileName = `${shortId.generate()}.${
          req.file.originalname.split(".")[1]
        }`;
        await sharp(req.file.buffer)
          .jpeg({
            quality: 60,
          })
          .toFile(`./public/uploads/images-profile/${fileName}`)
          .catch((err) => console.log(err));
        // res.status(200).send("آپلود عکس موفقیت آمیز بود");
        console.log(user);
        console.log(req.user.userImageProfile);
        user.userImageProfile = `http://localhost:3000/uploads/images-profile/${fileName}`;
        await user.save();
        await res
          .status(201)
          .send(`http://localhost:3000/uploads/images-profile/${fileName}`);
      } else {
        res.send("لطفا عکس انتخاب کن");
      }
    }
  });
};

exports.uploadImage = (req, res) => {
  const upload = multer({
    limits: { fileSize: 9000000 },
    // dest: "uploads/",
    // storage: storage,
    fileFilter: fileFilter,
  }).single("image");

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("حجم عکس نباید بیشتر 9 مگابایت باشد");
      }
      console.log("taha");
      console.log(err);
      res.status(400).send(err);
    } else {
      if (req.file) {
        console.log(req.file);
        const fileName = `${shortId.generate()}.${
          req.file.originalname.split(".")[1]
        }`;
        await sharp(req.file.buffer)
          .jpeg({
            quality: 60,
          })
          .toFile(`./public/uploads/images-post/${fileName}`)
          .catch((err) => console.log(err));

        await PostGallery.create({
          image: `http://localhost:3000/uploads/images-post/${fileName}`,
          user: req.user.id,
        });
        res
          .status(201)
          .send(`http://localhost:3000/uploads/images-post/${fileName}`);
      } else {
        res.send("لطفا عکس انتخاب کن");
      }
    }
  });
};

exports.uploadImageNemonekar = (req, res) => {
  const upload = multer({
    limits: { fileSize: 9000000 },
    // dest: "uploads/",
    // storage: storage,
    fileFilter: fileFilter,
  }).single("image");

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("حجم عکس نباید بیشتر 9 مگابایت باشد");
      }
      console.log("taha");
      console.log(err);
      res.status(400).send(err);
    } else {
      if (req.file) {
        const fileName = `${shortId.generate()}.${
          req.file.originalname.split(".")[1]
        }`;
        await sharp(req.file.buffer)
          .jpeg({
            quality: 60,
          })
          .toFile(`./public/uploads/images-nemonekar/${fileName}`)
          .catch((err) => console.log(err));
        await NemonekarGallery.create({
          image: `http://localhost:3000/uploads/images-nemonekar/${fileName}`,
          user: req.user.id,
        });
        res
          .status(201)
          .send(`http://localhost:3000/uploads/images-nemonekar/${fileName}`);
      } else {
        res.send("لطفا عکس انتخاب کن");
      }
    }
  });
};

exports.getDashbordNemonekar = async (req, res, next) => {
  const page = +req.query.page || 1;
  const postPerPage = 8;
  try {
    const numberOfNemonekarha = await Nemonekar.find({
      user: req.user.id,
    }).countDocuments();
    const nemonekarha = await Nemonekar.find({ user: req.user.id })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    res.render("nemonekar", {
      pageTitle: " نمونه کارها",
      path: "nemonekar",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      nemonekarha,
      formatDate,
      currentPage: page,
      nextPage: page + 1,
      next2Page: page + 2,
      next3Page: page + 3,
      previousPage: page - 1,
      previous2Page: page - 2,
      previous3Page: page - 3,
      hasNextPage: postPerPage * page < numberOfNemonekarha,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfNemonekarha / postPerPage),
    });
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};

exports.getDashbordAddNemonekar = async (req, res, next) => {
  res.render("addnemonekar", {
    pageTitle: "افزودن نمونه کار ",
    path: "addnemonekar",
    fullName: req.user.fullName,
    userImageProfile: req.user.userImageProfile,
  });
};

exports.postDashbordNemonekar = async (req, res, next) => {
  const images = [];
  const nemonekarha = await Nemonekar.find({});
  nemonekarha.forEach((nemonekar) => {
    images.push(nemonekar.deskImage, nemonekar.phoneImage);
  });
  try {
    await Nemonekar.nemonekarValidation(req.body);
    await Nemonekar.create({ ...req.body, user: req.user.id });
    res.redirect("/nemonekar");
  } catch (err) {
    const errorArr = [];
    console.log(err);

    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });

    res.render("addnemonekar", {
      pageTitle: "افزودن نمونه کار ",
      path: "addnemonekar",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      errors: errorArr,
      images,
    });
  }
};

exports.getEditNemonekar = async (req, res, next) => {
  const nemonekar = await Nemonekar.findOne({ _id: req.params.id });
  if (!nemonekar) {
    return res.redirect("/404");
  }

  if (nemonekar.user.toString() !== req.user._id.toString()) {
    return res.redirect("/adminpanel");
  } else {
    res.render("editNemonekar", {
      pageTitle: "ویرایش نمونه کار",
      path: "editNemonekar",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      nemonekar,
    });
  }
};

exports.postEditNemonekar = async (req, res, next) => {
  const nemonekar = await Nemonekar.findOne({ _id: req.params.id });

  try {
    await Nemonekar.nemonekarValidation(req.body);

    if (!nemonekar) {
      return res.redirect("/404");
    }

    if (nemonekar.user.toString() !== req.user._id.toString()) {
      return res.redirect("/adminpanel");
    } else {
      const { deskImage, phoneImage } = req.body;
      nemonekar.deskImage = deskImage;
      nemonekar.phoneImage = phoneImage;

      await nemonekar.save();
      return res.redirect("/nemonekar");
    }
  } catch (err) {
    const errorArr = [];
    console.log(err);

    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    const images = [];
    const nemonekarha = await Nemonekar.find({});
    nemonekarha.forEach((nemonekar) => {
      images.push(nemonekar.deskImage, nemonekar.phoneImage);
    });

    res.render("nemonekar", {
      pageTitle: " نمونه کارها",
      path: "nemonekar",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      nemonekarha,
      formatDate,
    });
  }
};

exports.getDeleteNemonekar = async (req, res, next) => {
  try {
    const nemonekar = await Nemonekar.findByIdAndRemove({ _id: req.params.id });
    console.log(nemonekar);
    res.redirect("/nemonekar");
  } catch (err) {
    console.log(err);
    res.render("500");
  }
};

exports.getPostGallery = async (req, res, next) => {
  const page = +req.query.page || 1;
  const postPerPage = 1;
  try {
    const images = [];
    const numberOfPostImage = await PostGallery.find({}).countDocuments();
    const postGallery = await PostGallery.find({})
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    postGallery.forEach((image) => {
      images.push(image.image);
    });
    res.render("postGallery", {
      pageTitle: "گالری پست ها",
      path: "gallery",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      images,
      currentPage: page,
      nextPage: page + 1,
      next2Page: page + 2,
      next3Page: page + 3,
      previousPage: page - 1,
      previous2Page: page - 2,
      previous3Page: page - 3,
      hasNextPage: postPerPage * page < numberOfPostImage,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfPostImage / postPerPage),
    });
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};

exports.getAddPostGallery = (req, res, next) => {
  res.render("uploadpost", {
    pageTitle: "آپلود عکس برای پست ها",
    path: "addPostGallery",
    fullName: req.user.fullName,
    userImageProfile: req.user.userImageProfile,
  });
};

exports.getNemonekarGallery = async (req, res, next) => {
  const page = +req.query.page || 1;
  const postPerPage = 1;
  try {
    const images = [];
    const numberOfNemonekarhaImage = await NemonekarGallery.find(
      {}
    ).countDocuments();
    const nemonekarGallery = await NemonekarGallery.find({})
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    nemonekarGallery.forEach((image) => {
      images.push(image.image);
    });
    res.render("nemonekarGallery", {
      pageTitle: "گالری نمونه کارها",
      path: "gallery",
      fullName: req.user.fullName,
      userImageProfile: req.user.userImageProfile,
      images,
      currentPage: page,
      nextPage: page + 1,
      next2Page: page + 2,
      next3Page: page + 3,
      previousPage: page - 1,
      previous2Page: page - 2,
      previous3Page: page - 3,
      hasNextPage: postPerPage * page < numberOfNemonekarhaImage,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfNemonekarhaImage / postPerPage),
    });
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};

exports.getAddNemonekarGallery = (req, res, next) => {
  res.render("uploadnemonekar", {
    pageTitle: "آپلود عکس برای نمونه کارها",
    path: "addPostGallery",
    fullName: req.user.fullName,
    userImageProfile: req.user.userImageProfile,
  });
};
