// INPORT LIBRARY
const Router = require("express").Router();

// INPORT CHILD ROUTES AND ASSETS
const authMiddleware = require("../middlewares/auth");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const business_dash = require("./business_dash.routes");
const influencer_dash = require("./influencer_dash.routes");



// BIND ROUTES FROM DFFRENT FILE
Router.use("/auth/", authRoutes);
Router.use("/user", authMiddleware, userRoutes);
Router.use("/buisness-dash", authMiddleware, business_dash);
Router.use("/influencer-dash", authMiddleware, influencer_dash);


module.exports = Router;
