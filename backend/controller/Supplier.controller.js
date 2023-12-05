const { and } = require("sequelize");
const sequelize = require("../database/sequelize");
const Supplier = require("../models/Supplier");
const SupplierPhoneNumber = require("../models/SupplierPhoneNumber");

async function addSupplierWithPhoneNumbers(supplierData, phoneNumbers) {
  let transaction;

  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Create a new Supplier
    const newSupplier = await Supplier.create(supplierData, { transaction });

    // Add phone numbers to the SupplierPhoneNumbers table
    const phoneNumberPromises = phoneNumbers.map((phoneNumber) => {
      return SupplierPhoneNumber.create(
        {
          SupplierCode: newSupplier.SupplierCode,
          PhoneNumber: phoneNumber,
        },
        { transaction }
      );
    });

    await Promise.all(phoneNumberPromises);

    // Commit the transaction
    await transaction.commit();

    console.log("New Supplier added successfully with phone numbers!");
    return newSupplier;
  } catch (error) {
    // If an error occurs, rollback the transaction
    if (transaction) await transaction.rollback();

    console.error("Error adding new Supplier:", error);
    throw error; // You can handle the error accordingly in your application
  }
}

async function getAllSuppliers() {
  try {
    const [results, metadata] = await sequelize.query(
      `
          SELECT Suppliers.SupplierCode, Suppliers.Name, Suppliers.Address, Suppliers.BankAccount, Suppliers.TaxCode, SupplierPhoneNumbers.PhoneNumber
          FROM Suppliers
          LEFT JOIN SupplierPhoneNumbers ON Suppliers.SupplierCode = SupplierPhoneNumbers.SupplierCode
        `
    );

    const mergedResults = results.reduce((acc, result) => {
      const existingSupplier = acc.find(
        (item) => item.SupplierCode === result.SupplierCode
      );

      if (existingSupplier) {
        existingSupplier.PhoneNumber.push(result.PhoneNumber);
      } else {
        acc.push({
          ...result,
          PhoneNumber: [result.PhoneNumber],
        });
      }

      return acc;
    }, []);

    return mergedResults;
  } catch (error) {
    console.error("Error retrieving suppliers with phone numbers:", error);
    throw error; // You can handle the error accordingly in your application
  }
}

async function getAllCategories() {
  try {
    const [results, metadata] = await sequelize.query(`
      SELECT
        Suppliers.SupplierCode,
        Suppliers.Name,
        Suppliers.Address,
        Suppliers.BankAccount,
        Suppliers.TaxCode,
        FabricCategories.Quantity,
        FabricCategories.CategoryCode,
        FabricCategories.Color,
        FabricCategories.CategoryName,
        IP.CurrentPrice,
        IP.PriceDate
      FROM
        Suppliers
      LEFT JOIN
        FabricCategories ON Suppliers.SupplierCode = FabricCategories.SupplierCode
      LEFT JOIN
        CurrentPrices IP ON IP.CategoryCode = FabricCategories.CategoryCode
    `);

    const mergedResults = results.reduce((acc, result) => {
      const existingSupplier = acc.find(
        (item) => item.SupplierCode === result.SupplierCode
      );

      if (existingSupplier) {
        const existingCategory = existingSupplier.Category.find(
          (category) => category.CategoryCode === result.CategoryCode
        );

        if (existingCategory) {
          // If the category already exists, add to HistoryPrice array\
          existingCategory.HistoryPrice.push(
            `Date: ${result.PriceDate}, Price: ${result.CurrentPrice}`
          );
        } else {
          // If the category does not exist, add a new category
          existingSupplier.Category.push({
            SupplierCode: result.SupplierCode,
            CategoryCode: result.CategoryCode,
            Quantity: result.Quantity,
            Color: result.Color,
            CategoryName: result.CategoryName,
            HistoryPrice: [
              `Date: ${result.PriceDate}, Price: ${result.CurrentPrice}`,
            ],
          });
        }
      } else {
        // If the supplier does not exist, add a new supplier along with the first category
        acc.push({
          SupplierCode: result.SupplierCode,
          Name: result.Name,
          Address: result.Address,
          BankAccount: result.BankAccount,
          TaxCode: result.TaxCode,
          Category: [
            {
              SupplierCode: result.SupplierCode,
              CategoryCode: result.CategoryCode,
              Quantity: result.Quantity,
              Color: result.Color,
              CategoryName: result.CategoryName,
              HistoryPrice: [
                `Date: ${result.PriceDate}, Price: ${result.CurrentPrice}`,
              ],
            },
          ],
        });
      }

      return acc;
    }, []);

    // Remove suppliers that have categories set to NULL
    const filteredResults = mergedResults.filter(
      (supplier) => supplier.Category[0].CategoryName != null
    );

    return filteredResults;
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
}

module.exports = {
  addSupplierWithPhoneNumbers,
  getAllSuppliers,
  getAllCategories,
};
