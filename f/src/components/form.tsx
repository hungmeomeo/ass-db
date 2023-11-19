import React, { useState } from "react";
import { Container } from "react-bootstrap";

interface Q2Props {}

interface FormValue {
  name: string;
  email: string;
  password: string;
  phoneNumbers: string[];
}

const Q2: React.FC<Q2Props> = (props) => {
  const [formvalue, setFormvalue] = useState<FormValue>({
    name: "",
    email: "",
    password: "",
    phoneNumbers: [""], // Initialize with one empty phone number
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormvalue({ ...formvalue, [name]: value });
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...formvalue.phoneNumbers];
    newPhoneNumbers[index] = value;
    setFormvalue({ ...formvalue, phoneNumbers: newPhoneNumbers });
  };

  const addPhoneNumber = () => {
    setFormvalue({
      ...formvalue,
      phoneNumbers: [...formvalue.phoneNumbers, ""],
    });
  };

  const handleFormsubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("http://localhost:3000/suppliers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formvalue.name,
        email: formvalue.email,
        password: formvalue.password,
        phoneNumbers: formvalue.phoneNumbers,
      }),
    });
    console.log("success");
  };

  return (
    <Container>
      <div>
        <div className="col-12 text-success">
          <h5 className="mt-4 mb-4 text-white">
            Post Form Data to Fetch API with React JS
          </h5>

          <form className="row" onSubmit={handleFormsubmit}>
            <div className="col-md-2">
              <label className="form-label text-white">Name</label>
              <input
                type="text"
                name="name"
                value={formvalue.name}
                onChange={handleInput}
                className="form-control"
                placeholder="Name..."
              />
            </div>

            <div className="col-md-2">
              <label className="form-label text-white">Email</label>
              <input
                type="text"
                name="email"
                value={formvalue.email}
                onChange={handleInput}
                className="form-control"
                placeholder="Email..."
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

            <div className="col-md-2">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                name="password"
                value={formvalue.password}
                onChange={handleInput}
                className="form-control"
                placeholder="Password..."
              />
            </div>

            <div className="col-md-1">
              <label className="form-label text-white">Action</label>
              <button className="form-control btn btn-success">Submit</button>
            </div>
          </form>
          <div className="col-md-2">
            <button
              className="form-control btn btn-success"
              onClick={addPhoneNumber}
            >
              Add Phone Number
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Q2;
