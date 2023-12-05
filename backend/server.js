const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors"); // Import the cors package
const handleSupplier = require("./routes/supplier.route");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const sequelize = require("./database/sequelize");

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

async function repeatQueryWithoutIndex() {
  const numOfRepeats = 1;
  const startTime = new Date();
  for (let i = 0; i < numOfRepeats; i++) {
    await sequelize.query(`SELECT * FROM Fabric.Bolts WHERE length = 10`);
  }
  const endTime = new Date();
  return endTime - startTime;
}

async function repeatQueryWithIndex() {
  await sequelize.query(`CREATE INDEX idx_length ON Bolts(length);`);
  const numOfRepeats = 1;
  const startTime = new Date();
  for (let i = 0; i < numOfRepeats; i++) {
    await sequelize.query(`SELECT * FROM Fabric.Bolts WHERE length = 10`);
  }
  const endTime = new Date();
  await sequelize.query(`DROP INDEX idx_length ON Bolts;`);
  return endTime - startTime;
}

async function indexCompare() {
  withIndexTime = await repeatQueryWithIndex();
  withoutIndexTime = await repeatQueryWithoutIndex();

  console.log(`Query with index took ${withIndexTime} milliseconds`);
  console.log(`Query without index took ${withoutIndexTime} milliseconds`);
}
indexCompare();
