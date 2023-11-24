import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Nav from "./navbar";

interface Q2Props {}

interface SupplierData {
  Name: string;
  Address: string;
  BankAccount: string;
  TaxCode: string;
}

interface FormValue {
  supplierData: SupplierData;
  phoneNumbers: string[];
}

const Q2: React.FC<Q2Props> = (props) => {
  const [formvalue, setFormvalue] = useState<FormValue>({
    supplierData: {
      Name: "",
      Address: "",
      BankAccount: "",
      TaxCode: "",
    },
    phoneNumbers: [""], // Initialize with one empty phone number
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update supplierData object using the spread operator
    setFormvalue((prevFormValue) => ({
      ...prevFormValue,
      supplierData: {
        ...prevFormValue.supplierData,
        [name]: value,
      },
    }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...formvalue.phoneNumbers];
    newPhoneNumbers[index] = value;

    // Update phoneNumbers array using the spread operator
    setFormvalue((prevFormValue) => ({
      ...prevFormValue,
      phoneNumbers: newPhoneNumbers,
    }));
  };

  const addPhoneNumber = () => {
    setFormvalue((prevFormValue) => ({
      ...prevFormValue,
      phoneNumbers: [...prevFormValue.phoneNumbers, ""],
    }));
  };

  const removePhoneNumber = (index: any) => {
    const updatedPhoneNumbers = [...formvalue.phoneNumbers];
    updatedPhoneNumbers.splice(index, 1);

    // Update phoneNumbers array using the spread operator
    setFormvalue((prevFormValue) => ({
      ...prevFormValue,
      phoneNumbers: updatedPhoneNumbers,
    }));
  };

  const handleFormsubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { supplierData, phoneNumbers } = formvalue;

    const inputData = {
      supplierData,
      phoneNumbers,
    };

    const response = await fetch("http://localhost:3000/suppliers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData),
    });

    if (response.ok) {
      alert("Success");
    } else {
      alert("Error");
      console.log(response); // log error response
    }
  };
  return (
    <div>
      <Nav></Nav>
      <Container>
        <h1 className="text-center mt-3 text-4xl font-bold">Add Suppliers</h1>
        <div>
          <div className="col-12 text-success">
            <div className="add-del">
              <button className="btn btn-success" onClick={addPhoneNumber}>
                Add Phone Number
              </button>

              <button className="btn btn-success" onClick={removePhoneNumber}>
                Remove Phone Number
              </button>
            </div>

            <div className="col-md-2"></div>

            <form className="row" onSubmit={handleFormsubmit}>
              <div className="col-md-2">
                <label className="form-label text-white">Name</label>
                <input
                  type="text"
                  name="Name"
                  value={formvalue.supplierData.Name}
                  onChange={handleInput}
                  className="form-control"
                  placeholder="Name..."
                />
              </div>

              <div className="col-md-2">
                <label className="form-label text-white">Address</label>
                <input
                  type="text"
                  name="Address"
                  value={formvalue.supplierData.Address}
                  onChange={handleInput}
                  className="form-control"
                  placeholder="Address..."
                />
              </div>

              <div className="col-md-2">
                <label className="form-label text-white">Tax Code</label>
                <input
                  type="text"
                  name="TaxCode"
                  value={formvalue.supplierData.TaxCode}
                  onChange={handleInput}
                  className="form-control"
                  placeholder="Tax Code..."
                />
              </div>

              <div className="col-md-2">
                <label className="form-label text-white">Bank Account</label>
                <input
                  type="text"
                  name="BankAccount"
                  value={formvalue.supplierData.BankAccount}
                  onChange={handleInput}
                  className="form-control"
                  placeholder="Bank Account..."
                />
              </div>

              {formvalue.phoneNumbers.map((phoneNumber, index) => (
                <div key={index} className="col-md-2">
                  <label className="form-label text-white">
                    Phone {index + 1}
                  </label>
                  <input
                    type="text"
                    name={`phoneNumbers[${index}]`}
                    value={phoneNumber}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, e.target.value)
                    }
                    className="form-control"
                    placeholder={`Phone ${index + 1}...`}
                  />
                </div>
              ))}

              <div className="col-md-1">
                <label className="form-label text-white">Action</label>
                <button className="form-control btn btn-success">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Q2;
