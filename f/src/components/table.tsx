import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";

interface Supplier {
  SupplierCode: string;
  Name: string;
  Address: string;
  BankAccount: string;
  TaxCode: string;
  PhoneNumber: string[];
}

function Q1() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

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

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.PhoneNumber.some((number) =>
        number.includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div>
      <Container>
        <h1 className="text-center mt-4">Contact Keeper</h1>
        <Form>
          <InputGroup className="my-3">
            <Form.Control
              onChange={(e) => setSearchTerm(e.target.value)}
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
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default Q1;
