// IMPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/influencer_jobs.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/get-jobs', [], controller.getJobs);
Router.get('/get-my-applied-jobs', [], controller.getMyAppliedJobs);
Router.get('/filter-by-role', [], controller.filterByRole);
Router.get('/filter-by-location', [], controller.filterByLocation);
Router.get('/filter-my-job-by-headline', [], controller.filterMyJobByHeadline);

module.exports = Router;
