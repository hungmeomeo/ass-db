const fs = require("fs");
const XLSX = require("xlsx");
const {
  getCategoriesByCustomerCode,
} = require("../controller/Order.controller");

async function generateXLSX() {
  const customerCode = "Cust1"; // Replace this with the actual customer code
  try {
    const data = await getCategoriesByCustomerCode(customerCode);

    // Ensure that data is an array before proceeding
    if (!Array.isArray(data)) {
      throw new Error("Data is not in the expected format");
    }

    // Create a workbook
    const wb = XLSX.utils.book_new();

    // Add each category as a separate worksheet
    data.forEach((category) => {
      const ws = XLSX.utils.json_to_sheet(category.Orders);
      XLSX.utils.book_append_sheet(wb, ws, category.CategoryCode);
    });

    // Specify the path where you want to save the file
    const filePath = "./output.xlsx";

    // Write the workbook to the specified file
    XLSX.writeFile(wb, filePath);

    console.log(`XLSX file created successfully at ${filePath}.`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the function to generate the XLSX file
generateXLSX();
