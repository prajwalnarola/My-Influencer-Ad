// IMPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/business_jobs.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/get-jobs', [], controller.getJobs);
Router.get('/get-my-jobs', [], controller.getMyJobs);
Router.post('/update-my-jobs', [], controller.updatePost);

module.exports = Router;
