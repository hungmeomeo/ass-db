const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fabric", "root", "Hung111103!", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
