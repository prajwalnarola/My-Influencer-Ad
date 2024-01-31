// IMPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/influencer_dash.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/getDetails', [], controller.getAllDetails);
Router.post('/apply-jobs', [validator.validateApplyJobs], controller.applyJobs);
// Router.get('/get_jobs', [], controller.getJobs);

module.exports = Router;
