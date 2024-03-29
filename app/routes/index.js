// INPORT LIBRARY
const Router = require("express").Router();

// INPORT CHILD ROUTES AND ASSETS
const authMiddleware = require("../middlewares/auth");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const business_dash = require("./business_dash.routes");
const influencer_dash = require("./influencer_dash.routes");
const business_jobs = require("./business_jobs.routes");
const influencer_jobs = require("./influencer_jobs.routes");



// BIND ROUTES FROM DFFRENT FILE
Router.use("/auth/", authRoutes);
Router.use("/user", authMiddleware, userRoutes);
Router.use("/buisness-dash", authMiddleware, business_dash);
Router.use("/influencer-dash", authMiddleware, influencer_dash);
Router.use("/business-jobs", authMiddleware, business_jobs);
Router.use("/influencer-jobs", authMiddleware, influencer_jobs);

module.exports = Router;
