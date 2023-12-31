import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { debounce } from "lodash";
import Nav from "./navbar";
import Picker from "../utils/picker";

interface Category {
  SupplierCode: string;
  CategoryCode: string;
  Quantity: number;
  Color?: string;
  CategoryName?: string;
  HistoryPrice?: string[];
}

interface Supplier {
  SupplierCode: string;
  Name: string;
  Address: string;
  BankAccount: string;
  TaxCode: string;
  PhoneNumber: string[];
  Category?: Category[];
}

function Q3() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/suppliers/all");
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = async (SupplierCode: string) => {
    console.log(`Button clicked for SupplierCode: ${SupplierCode}`);
    try {
      const response = await fetch(
        "http://localhost:3000/suppliers/categories"
      );
      const data = await response.json();
      console.log(data);
      // Find the supplier with the clicked supplier code
      const clickedSupplier = data.find(
        (supplier: Supplier) => supplier.SupplierCode === SupplierCode
      );

      // Set the categories for the clicked supplier
      setCategories(clickedSupplier?.Category || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const delayedSearch = debounce((searchValue: string) => {
    setSearchTerm(searchValue);
  }, 300);

  const filteredSuppliers = searchTerm
    ? suppliers.filter(
        (supplier: Supplier) =>
          supplier.Name.toLowerCase().includes(lowerCaseSearchTerm) ||
          supplier.PhoneNumber.some(
            (number) =>
              number && number.toLowerCase().includes(lowerCaseSearchTerm)
          )
      )
    : suppliers;

  return (
    <div>
      <Nav></Nav>

      <Container>
        <h1 className="text-center mt-3 text-4xl font-bold">Category Info</h1>

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
              <th>Supplier Code</th>
              <th>Name</th>
              <th>Address</th>
              <th>Bank Account</th>
              <th>Tax Code</th>
              <th>Phone Number</th>
              <th>Categories</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.SupplierCode}>
                <td>{supplier.SupplierCode}</td>
                <td>{supplier.Name}</td>
                <td>{supplier.Address}</td>
                <td>{supplier.BankAccount}</td>
                <td>{supplier.TaxCode}</td>
                <td>{supplier.PhoneNumber.join(", ")}</td>
                <td>
                  <button
                    onClick={() => handleButtonClick(supplier.SupplierCode)}
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Supplier Code</th>
                <th>Category Code</th>
                <th>Category Name</th>
                <th>Available Quantity</th>
                <th>Color</th>
                <th>History Price</th>
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
                  <td>
                    {category.HistoryPrice?.map((price, index) => (
                      <div key={index}>{price}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

export default Q3;
