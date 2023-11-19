const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize"); // Assuming you've configured your database connection
//const SupplierPhoneNumbers = require("./SupplierPhoneNumber");

function generateRandomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 50; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const Supplier = sequelize.define(
  "Supplier",
  {
    SupplierCode: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      defaultValue: generateRandomCode,
    },
    Name: {
      type: DataTypes.STRING(255),
    },
    Address: {
      type: DataTypes.STRING(255),
    },
    BankAccount: {
      type: DataTypes.STRING(20),
      validate: {
        is: /^[0-9]+$/,
      },
    },
    TaxCode: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: "Suppliers", // Specify the existing table name
    timestamps: false, // If your table doesn't have timestamps
  }
);

module.exports = Supplier;
