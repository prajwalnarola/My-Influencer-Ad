// IMPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/business_dash.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post('/create-post', [], controller.createPost);
// Router.post('/update', [], controller.updateProfile);
// Router.post('/change-password', [validator.validateChangePassword], controller.changePassword);
// Router.post('/delete-account', [], controller.deleteAccount);
// Router.post('/logout', [], controller.logout);

module.exports = Router;
