import React, { useState } from "react";

interface AddSupplierFormProps {
  onSubmit: (newSupplier: NewSupplier) => void;
}

interface NewSupplier {
  SupplierCode: string;
  Name: string;
  Address: string;
  BankAccount: string;
  TaxCode: string;
  PhoneNumber: string[];
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ onSubmit }) => {
  const [newSupplier, setNewSupplier] = useState<NewSupplier>({
    SupplierCode: "",
    Name: "",
    Address: "",
    BankAccount: "",
    TaxCode: "",
    PhoneNumber: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSupplier((prevSupplier) => ({
      ...prevSupplier,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    setNewSupplier((prevSupplier) => {
      const newPhoneNumbers = [...prevSupplier.PhoneNumber];
      newPhoneNumbers[index] = value;
      return {
        ...prevSupplier,
        PhoneNumber: newPhoneNumbers,
      };
    });
  };

  const addPhoneNumber = () => {
    setNewSupplier((prevSupplier) => ({
      ...prevSupplier,
      PhoneNumber: [...prevSupplier.PhoneNumber, ""],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newSupplier);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="Name"
          value={newSupplier.Name}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Address:
        <input
          type="text"
          name="Address"
          value={newSupplier.Address}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Bank Account:
        <input
          type="text"
          name="BankAccount"
          value={newSupplier.BankAccount}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Tax Code:
        <input
          type="text"
          name="TaxCode"
          value={newSupplier.TaxCode}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        {newSupplier.PhoneNumber.map((phoneNumber, index) => (
          <div key={index}>
            <input
              type="tel"
              name={`phoneNumber${index}`}
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
              placeholder="Phone Number"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addPhoneNumber}>
          Add Phone Number
        </button>
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddSupplierForm;
