require("dotenv").config();
const Sequelize = require("sequelize");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = ""

const sequelize = new Sequelize(dbName, dbUser, dbPassword,{
    port: process.env.PORT,
    host: process.env.DB_HOST,
    dialect: "mysql"
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model")(sequelize, Sequelize);
db.deviceToken = require("../models/device_token.model")(sequelize, Sequelize);
db.jobs = require("../models/jobs.model")(sequelize, Sequelize);
db.advertising_platform = require("../models/advertising_platform.model")(sequelize, Sequelize);
db.industry = require("../models/industry.model")(sequelize, Sequelize);
db.candidates = require("../models/candidates.model")(sequelize, Sequelize);
db.available_platforms = require("../models/available_platforms.model")(sequelize, Sequelize);
db.available_industries = require("../models/available_industries.model")(sequelize, Sequelize);

// has RELATIONS (HasMany / HasOne)
db.user.hasOne(db.deviceToken, { as: "devicetoken", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasMany(db.jobs, { as: "jobs", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.jobs.hasMany(db.advertising_platform, { as: "adevertising_platform", foreignKey: "job_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.jobs.hasMany(db.industry, { as: "industry", foreignKey: "job_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.user.hasOne(db.candidates, { as: "cadidates", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.jobs.hasMany(db.candidates, { as: "candidates", foreignKey: "job_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.available_platforms.hasMany(db.advertising_platform, { as: "advertising_platform", foreignKey: "platform_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.available_industries.hasMany(db.industry, { as: "industry", foreignKey: "industry_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

// belongsTO RELATION (BelongsTo / BelongsToMany)(foreign-key)
db.deviceToken.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.jobs.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.advertising_platform.belongsTo(db.jobs, { as: "jobs", foreignKey: "job_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.industry.belongsTo(db.jobs, { as: "jobs", foreignKey: "job_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.candidates.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.candidates.belongsTo(db.jobs, { as: "jobs", foreignKey: "job_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.advertising_platform.belongsTo(db.available_platforms, { as: "available_platforms", foreignKey: "platform_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.industry.belongsTo(db.available_industries, { as: "available_industries", foreignKey: "industry_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

module.exports = db

