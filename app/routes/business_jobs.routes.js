// IMPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/business_jobs.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/get-jobs', [], controller.getJobs);
Router.get('/get-my-jobs', [], controller.getMyJobs);
Router.post('/update-my-job', [], controller.updatePost);
Router.post('/update-my-job-status', [], controller.updateJobStatus);
Router.post('/shortlisting-status', [], controller.updateShortlistingStatus);
Router.post('/hiring-status', [], controller.updateHiringStatus);
Router.get('/filter-by-role', [], controller.filterByRole);
Router.get('/filter-by-location', [], controller.filterByLocation);
Router.get('/filter-my-job-by-role', [], controller.filterMyJobByRole);
Router.get('/filter-my-job-by-location', [], controller.filterMyJobByLocation);

module.exports = Router;
