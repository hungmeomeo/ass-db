const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors"); // Import the cors package
const handleSupplier = require("./routes/supplier.route");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//mysqlConnect();

// Enable CORS for all routes by setting origin to "*"
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // Enable credentials (e.g., cookies, authorization headers)
  })
);

app.use("/suppliers", handleSupplier);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
