// IMPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/business_dash.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/get-platforms', [], controller.getPlatforms);
Router.get('/get-industries', [], controller.getIndustries);
Router.post('/create-post', [validator.validatePost], controller.createPost);
Router.get('/getDetails', [], controller.getAllDetails);
Router.get('/get-jobs', [], controller.getJobs);

module.exports = Router;
