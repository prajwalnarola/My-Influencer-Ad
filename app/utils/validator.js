const { check, param, query } = require("express-validator");
// THIS IS VALIDATION FILE IN WHICH WE HAVE PUT ALL THE VALIDATION.
// HERE ARE THE ONLY FEW VALIDATIONS BUT IF MORE VALIDATIONS THE BEST PRACTISE IS TO CREATE DIFFRENT FILES FOR VALIDATIONS AND BIND IT IN ONE INDEX FILE.

exports.validateLogin = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("password").notEmpty().withMessage("password field is required!"),
];

exports.validateRegister = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("name").notEmpty().withMessage("name field is required!"),
  check("phone_number").notEmpty().withMessage("valid phone_number field is required!"),
  check("profession_type").notEmpty().withMessage("valid profession_type field is required!"),
  check("password").notEmpty().withMessage("password field is required!"),
];

exports.validateForgotPassword = [
  check("email").isEmail().withMessage("email field is required with a valid email!")
];

exports.validateChangePassword = [
  check("old_password").notEmpty().withMessage("old_password field is required!"),
  check("new_password").notEmpty().withMessage("new_password field is required!")
];

exports.validatePost = [
  check("headline").notEmpty().withMessage("headline field is required!"),
  check("description").notEmpty().withMessage("description field is required!"),
  check("website").isURL().withMessage("valid website field is required!"),
  check("minimum_followers").notEmpty().withMessage("valid minimum_followers field is required!"),
  check("due_date").notEmpty().withMessage("valid due_date is required!"),
  check("open_to_applicants").notEmpty().withMessage("valid open_to_applicants field is required!"),
  check("age_range").notEmpty().withMessage("valid age_range field is required!"),
  check("role").notEmpty().withMessage("valid role field is required!"),
  check("budget").notEmpty().withMessage("valid budget field is required!"),
  check("job_status").notEmpty().withMessage("valid job_status field is required!"),
];

exports.validateApplyJobs = [
  check("job_id").notEmpty().withMessage("job_id field is required!"),
  check("bid_amount").notEmpty().withMessage("valid bid_amount field is required!"),
  check("cover_letter").notEmpty().withMessage("valid cover_letter is required!"),
];
