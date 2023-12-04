const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize"); // Assuming you've configured your database connection
const Supplier = require("./Supplier");

const SupplierPhoneNumber = sequelize.define(
  "SupplierPhoneNumbers",
  {
    SupplierCode: {
      type: DataTypes.STRING(50),
      references: {
        model: Supplier,
        key: "SupplierCode",
      },
    },
    PhoneNumber: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      validate: {
        is: /^[0-9]+$/,
      },
    },
  },
  {
    tableName: "SupplierPhoneNumbers", // Specify the existing table name
    timestamps: false, // If your table doesn't have timestamps
  }
);

module.exports = SupplierPhoneNumber;
