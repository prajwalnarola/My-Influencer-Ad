const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      profile: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isAlphanumeric: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      phone_number: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      profession_type: {
        type: Sequelize.ENUM,
        values: [
          "Influencer",
          "Business",
        ],
      },
      password: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      uuid: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
        comment: "0 = false, 1 = true",
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
        comment: "0 = false, 1 = true",
      },
      is_testdata: {
        type: Sequelize.BOOLEAN,
        defaultValue: "1",
        comment: "0 = false, 1 = true",
      },
    },
    { freezeTableName: true, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" },
  );

  User.beforeCreate((user, options) => {
    user.uuid = uuidv4();
    user.password = bcrypt.hashSync(user.password, saltRounds);
  });

  return User;
};
