const Yup = require("yup");

exports.schema = Yup.object().shape({
  fullName: Yup.string()
    .required("نام و نام خانوادگی الزامیست")
    .min(4, "نام و نام خانوادگی باید بیشتر از 4 کاراکتر باشد")
    .max(255, "نام و نام خانوادگی باید کمتر از 255 کاراکتر باشد"),
  email: Yup.string().email().required("ایمیل معتبر نمی باشد"),
  password: Yup.string()
    .min(4, "رمز عبور باید بیشتر از 4 کاراکتر باشد")
    .max(255, "رمز عبور باید کمتر از 255 کاراکتر باشد")
    .required("رمز عبور الزامیست"),
});

exports.editFullNameSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("نام و نام خانوادگی الزامیست")
    .min(4, "نام و نام خانوادگی باید بیشتر از 4 کاراکتر باشد")
    .max(255, "نام و نام خانوادگی باید کمتر از 255 کاراکتر باشد"),
});
exports.editPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(4, "رمز عبور باید بیشتر از 4 کاراکتر باشد")
    .max(255, "رمز عبور باید کمتر از 255 کاراکتر باشد")
    .required("رمز عبور الزامیست"),
});
