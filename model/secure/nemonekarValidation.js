const Yup = require("yup");

exports.schema = Yup.object().shape({
  deskImage: Yup.string().required("لطفا عکس دسکتاپ وب سایت را انتخاب کن"),
  phoneImage: Yup.string().required("لطفا عکس ریسپانسیو وب سایت راانتخاب کن"),
});
