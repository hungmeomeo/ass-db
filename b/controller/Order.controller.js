const sequelize = require("../database/sequelize");

async function getOrders() {
  {
    try {
      const [results, metadata] = await sequelize.query(`
      SELECT
      C.CustomerCode,
      C.FirstName AS CustomerFirstName,
      C.LastName AS CustomerLastName,
      C.Address AS CustomerAddress,
      C.PhoneNumber AS CustomerPhoneNumber,
      F.CategoryCode,
      F.CategoryName AS FabricName,
      F.Color,
      F.Quantity,
      B.BoltCode,
      B.Length,
      O.OrderCode,
      O.OrderDate,
      O.TotalPrice,
      O.OrderStatus,
      P.PaymentDate,
      P.Amount,
      E.EmployeeCode As EmployeeCode,
      E.Name As EmployeeName
    FROM
      Customers C

    LEFT JOIN
      Orders O ON C.CustomerCode = O.CustomerCode
LEFT JOIN 
Employees E on E.EmployeeCode = O.EmployeeCode
    LEFT JOIN
      Bolts B ON O.OrderCode = B.OrderCode
    LEFT JOIN
      FabricCategories F ON B.CategoryCode = F.CategoryCode
    LEFT JOIN
      PaymentHistory P ON O.OrderCode = P.OrderCode
    ORDER BY
      C.CustomerCode, F.CategoryCode, O.OrderCode, P.PaymentDate
          `);

      const customers = [];
      let currentCustomer, currentCategory, currentOrder;

      for (const result of results) {
        if (
          !currentCustomer ||
          currentCustomer.CustomerCode !== result.CustomerCode
        ) {
          currentCustomer = {
            CustomerCode: result.CustomerCode,
            CustomerFirstName: result.CustomerFirstName,
            CustomerLastName: result.CustomerLastName,
            CustomerAddress: result.CustomerAddress,
            CustomerPhoneNumber: result.CustomerPhoneNumber,
            Categories: [],
          };
          customers.push(currentCustomer);
        }

        if (
          !currentCategory ||
          currentCategory.CategoryCode !== result.CategoryCode
        ) {
          currentCategory = {
            CategoryCode: result.CategoryCode,
            Orders: [],
          };
          currentCustomer.Categories.push(currentCategory);
        }

        if (!currentOrder || currentOrder.OrderCode !== result.OrderCode) {
          currentOrder = {
            CategoryCode: result.CategoryCode,
            FabricName: result.FabricName,
            Color: result.Color,
            Quantity: result.Quantity,
            OrderCode: result.OrderCode,
            OrderDate: result.OrderDate,
            TotalPrice: result.TotalPrice,
            OrderStatus: result.OrderStatus,
            PaymentDate: result.PaymentDate,
            BoltCode: result.BoltCode,
            Amount: result.Amount,
            Length: result.Length,
            EmployeeID: result.EmployeeCode,
            EmployeeName: result.EmployeeName,
          };
          currentCategory.Orders.push(currentOrder);
        }
      }

      return customers;
    } catch (error) {
      console.error("Error retrieving customer data:", error);
      throw error;
    }
  }
}

async function getCategoriesByCustomerCode(customerCode) {
  try {
    if (!customerCode) {
      throw new Error("Missing customerCode");
    }

    const customers = await getOrders(); // Replace with your actual data retrieval function
    console.log(customers);
    const customer = customers.find((c) => c.CustomerCode === customerCode);
    console.log(customer);
    if (!customer) {
      throw new Error("Customer not found");
    }
    console.log(customer.Categories);
    return customer.Categories;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

module.exports = {
  getOrders,
  getCategoriesByCustomerCode,
};
