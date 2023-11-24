import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { debounce } from "lodash";
import Nav from "./navbar";

interface Customer {
  CustomerCode: string;
  CustomerFirstName: string;
  CustomerLastName: string;
  CustomerAddress: string;
  CustomerPhoneNumber: string;
}

function Q4() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<
    {
      CustomerCode: string;
      CustomerFirstName: string;
      CustomerLastName: string;
      CustomerAddress: string;
      CustomerPhoneNumber: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/suppliers/customers/all"
        );
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = async (CustomerCode: string) => {
    console.log(`Button clicked for SupplierCode: ${CustomerCode}`);

    try {
      const response = await fetch(
        `http://localhost:3000/suppliers/xlsx/${CustomerCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      // Check if the response is successful (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a Blob URL for the Blob data
      const blobUrl = URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement("a");

      // Set the link's href attribute to the Blob URL
      link.href = blobUrl;

      // Set the download attribute to specify the filename
      link.download = CustomerCode + ".xlsx";

      // Append the link to the document
      document.body.appendChild(link);

      // Trigger a click on the link to start the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      // Revoke the Blob URL to free up resources
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const delayedSearch = debounce((searchValue: string) => {
    setSearchTerm(searchValue);
  }, 300);

  const filteredSuppliers = searchTerm
    ? customers.filter(
        (customer) =>
          customer.CustomerFirstName.toLowerCase().includes(
            lowerCaseSearchTerm
          ) ||
          customer.CustomerLastName.toLowerCase().includes(
            lowerCaseSearchTerm
          ) ||
          customer.CustomerPhoneNumber.includes(lowerCaseSearchTerm)
      )
    : customers;

  return (
    <div>
      <Nav></Nav>
      <Container>
        <h1 className="text-center mt-4">Contact Keeper</h1>
        <Form>
          <InputGroup className="my-3">
            <Form.Control
              onChange={(e) => delayedSearch(e.target.value)}
              placeholder="Search contacts"
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Customer Code</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Phone Number</th>

              <th>Categories</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((customer) => (
              <tr key={customer.CustomerCode}>
                <td>{customer.CustomerCode}</td>
                <td>{customer.CustomerFirstName}</td>
                <td>{customer.CustomerLastName}</td>
                <td>{customer.CustomerAddress}</td>
                <td>{customer.CustomerPhoneNumber}</td>
                <td>
                  <button
                    onClick={() => handleButtonClick(customer.CustomerCode)}
                  >
                    Click me
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <h2>Supplier Categories</h2>
          {/* <Table striped bordered hover>
            <thead>
              <tr>
                <th>Supplier Code</th>
                <th>Category Code</th>
                <th>Category Name</th>
                <th>Quantity</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.CategoryCode}>
                  <td>{category.SupplierCode}</td>
                  <td>{category.CategoryCode}</td>
                  <td>{category.CategoryName}</td>
                  <td>{category.Quantity}</td>
                  <td>{category.Color}</td>
                </tr>
              ))}
            </tbody>
          </Table> */}
        </div>
      </Container>
    </div>
  );
}

export default Q4;
