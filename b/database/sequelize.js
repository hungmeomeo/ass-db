const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fabric", "hunghoang", "12345678", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
