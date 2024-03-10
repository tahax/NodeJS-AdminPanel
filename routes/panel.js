const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");
const adminController = require("../controller/adminController");
const userController = require("../controller/userController");

const router = new Router();
/* adminpanel */
router.get("/adminpanel", authenticated, adminController.getDashbord);
/* /adminpanel */

/* profile */
router.get("/profile", authenticated, adminController.getProfile);
router.post("/editusername", authenticated, userController.editUserName);
router.post("/editpassword", authenticated, userController.editPassword);
/* /profile */

/* image upload */
router.post("/post-image-upload", authenticated, adminController.uploadImage);
router.get(
  "/post-image-upload",
  authenticated,
  adminController.getAddPostGallery
);
router.post(
  "/nemonekar-image-upload",
  authenticated,
  adminController.uploadImageNemonekar
);
router.get(
  "/nemonekar-image-upload",
  authenticated,
  adminController.getAddNemonekarGallery
);
router.post(
  "/profile-image-upload",
  authenticated,
  adminController.uploadImageProfile
);
/* /image upload */

/* * blog * */
router.get("/blog", authenticated, adminController.getDashbordBlog);

router.get("/addBlog", authenticated, adminController.getDashbordAddBlog);
router.post("/addBlog", authenticated, adminController.postCreatBlog);

router.get("/edit-post/:id", authenticated, adminController.getEditPost);
router.post("/edit-post/:id", authenticated, adminController.postEditPost);

router.get("/delete-post/:id", authenticated, adminController.getDeletePost);
/* *  /blog * */

/* *  nemonekar * */
router.get("/nemonekar", authenticated, adminController.getDashbordNemonekar);

router.get(
  "/addnemonekar",
  authenticated,
  adminController.getDashbordAddNemonekar
);
router.post(
  "/addnemonekar",
  authenticated,
  adminController.postDashbordNemonekar
);

router.get(
  "/edit-nemonekar/:id",
  authenticated,
  adminController.getEditNemonekar
);
router.post(
  "/edit-nemonekar/:id",
  authenticated,
  adminController.postEditNemonekar
);

router.get(
  "/delete-nemonekar/:id",
  authenticated,
  adminController.getDeleteNemonekar
);
/* * /nemonekar * */

/* gallery */
router.get("/postgallery", authenticated, adminController.getPostGallery);
router.get(
  "/nemonekargallery",
  authenticated,
  adminController.getNemonekarGallery
);
/* /gallery */

module.exports = router;
