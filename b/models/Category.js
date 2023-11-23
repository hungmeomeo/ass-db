const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize"); // Assuming you've configured your database connection
const Supplier = require("./Supplier");

function generateRandomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const Category = sequelize.define(
  "fabriccategories",
  {
    SupplierCode: {
      type: DataTypes.STRING(50),
      references: {
        model: Supplier,
        key: "SupplierCode",
      },
    },
    CategoryCode: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      defaultValue: generateRandomCode, // Assuming you have a function like this for generating random codes
    },
    CategoryName: {
      type: DataTypes.STRING(255),
    },
    Color: {
      type: DataTypes.STRING(255),
    },
    Quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "fabriccategories", // Specify the existing table name
    timestamps: false, // If your table doesn't have timestamps
  }
);

module.exports = Category;
