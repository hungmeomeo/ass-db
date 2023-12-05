// Picker.tsx
import React, { useState } from "react";
import moment from "moment";

interface PickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const Picker: React.FC<PickerProps> = ({ onDateRangeChange }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");

  return (
    <div className="date-picker-container">
      <div className="date-picker-input">
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={selectedStartDate}
          onChange={(e) => setSelectedStartDate(e.target.value)}
          onBlur={() => onDateRangeChange(selectedStartDate, selectedEndDate)}
        />
      </div>
      <div className="date-picker-input">
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={selectedEndDate}
          onChange={(e) => setSelectedEndDate(e.target.value)}
          onBlur={() => onDateRangeChange(selectedStartDate, selectedEndDate)}
        />
      </div>
    </div>
  );
};

export default Picker;
