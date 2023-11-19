const { Router } = require("express");
const {
  addSupplierWithPhoneNumbers,
  getAllSuppliers,
  getAllCategories,
} = require("../controller/Supplier.controller");
const { getOrders } = require("../controller/Order.controller");
const PDFDocument = require("pdfkit");
const path = require("path");
const router = Router();
const fs = require("fs");
const XLSX = require("xlsx");
const {
  getCategoriesByCustomerCode,
} = require("../controller/Order.controller");

router.post("/add", async (req, res) => {
  const { supplierData, phoneNumbers } = req.body;

  try {
    const newSupplier = await addSupplierWithPhoneNumbers(
      supplierData,
      phoneNumbers
    );
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const suppliers = await getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const suppliers = await getAllCategories();
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/customers", async (req, res) => {
  try {
    const { customerCode } = req.body;
    if (!customerCode) {
      return res
        .status(400)
        .json({ error: "Missing customerCode in the request body" });
    }

    const customers = await getOrders(); // Replace with your actual data retrieval function

    const customer = customers.find((c) => c.CustomerCode === customerCode);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const categories = customer.Categories;

    res.json(categories);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/xlsx", async (req, res) => {
  const { customerCode } = req.body;

  try {
    const data = await getCategoriesByCustomerCode(customerCode);

    // Ensure that data is an array before proceeding
    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Data is not in the expected format" });
    }

    // Create a workbook
    const wb = XLSX.utils.book_new();

    // Add each category as a separate worksheet
    data.forEach((category) => {
      const ws = XLSX.utils.json_to_sheet(category.Orders);
      XLSX.utils.book_append_sheet(wb, ws, category.CategoryCode);
    });

    // Specify the path where you want to save the file
    const filePath = path.join(__dirname, "../../report/output.xlsx");

    // Write the workbook to the specified file
    XLSX.writeFile(wb, filePath);

    console.log(`XLSX file created successfully at ${filePath}.`);

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${encodeURIComponent("output.xlsx")}`
    );

    // Pipe the file stream to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
