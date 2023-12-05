const sequelize = require("../database/sequelize");

async function getImport() {
  try {
    const [results, metadata] = await sequelize.query(`
    SELECT S.*, F.*, H.*
    FROM suppliers S
    LEFT JOIN FabricCategories F ON F.SupplierCode = S.SupplierCode
    LEFT JOIN CategoryImportHistory H ON H.CategoryCode = F.CategoryCode
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
          // If the category already exists, add to HistoryPrice array
          existingCategory.HistoryPrice.push(
            `Quantity: ${result.Quantity}, Price: ${result.ImportPrice}, Date: ${result.ImportDate}`
          );
        } else {
          // If the category does not exist, add a new category
          existingSupplier.Category.push({
            SupplierCode: result.SupplierCode,
            CategoryCode: result.CategoryCode,
            Color: result.Color,
            CategoryName: result.CategoryName,
            HistoryPrice: [
              `Quantity: ${result.Quantity}, Price: ${result.ImportPrice}, Date: ${result.ImportDate}`,
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
                `Quantity: ${result.Quantity}, Price: ${result.ImportPrice}, Date: ${result.ImportDate}`,
              ],
            },
          ],
        });
      }

      return acc;
    }, []);

    return mergedResults;
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
}

module.exports = {
  getImport,
};
