import React, { useState, useEffect } from 'react';

const CSVTable = ({ csvData }) => {
  const [tableData, setTableData] = useState([]);

  // List of allowed data types for the 'Type' column
  const allowedDataTypes = ["string", "number", "boolean", "array", "object"];

  // This effect runs once the csvData prop is passed in
  useEffect(() => {
    if (csvData) {
      const rows = csvData.split('\n').map((row) => row.split(','));
      setTableData(rows);
    }
  }, [csvData]);

  // Toggle the "Required" column between True/False
  const toggleRequired = (rowIndex) => {
    const updatedData = [...tableData];
    const currentRequired = updatedData[rowIndex + 1][4];  // 'Required' column index is 4
    updatedData[rowIndex + 1][4] = currentRequired === 'True' ? 'False' : 'True';
    setTableData(updatedData);
  };

  // Handle editing of the 'Default' column
  const handleDefaultChange = (rowIndex, newValue) => {
    const updatedData = [...tableData];
    updatedData[rowIndex + 1][5] = newValue;  // 'Default' column index is 5
    setTableData(updatedData);
  };

  // Handle editing of the 'Type' column using a dropdown
  const handleTypeChange = (rowIndex, newValue) => {
    const updatedData = [...tableData];
    updatedData[rowIndex + 1][3] = newValue;  // 'Type' column index is 3
    setTableData(updatedData);
  };

  if (!csvData) {
    return <p>No CSV data to display</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {tableData[0] && tableData[0].map((header, index) => {
            // Skip the uid column (index 0)
            if (header === "uid") return null; 
            return <th key={index}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {tableData.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => {
              // Skip the 'uid' column (index 0)
              if (cellIndex === 0) return null;

              // Render the 'Required' column as a clickable toggle
              if (cellIndex === 4) {
                return (
                  <td
                    key={cellIndex}
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => toggleRequired(rowIndex)}
                  >
                    {cell}
                  </td>
                );
              }

              // Render the 'Default' column as an input field
              if (cellIndex === 5) {
                return (
                  <td key={cellIndex}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleDefaultChange(rowIndex, e.target.value)}
                    />
                  </td>
                );
              }

              // Render the 'Type' column as a dropdown if the cell is empty
              if (cellIndex === 3 && cell === '') {
                return (
                  <td key={cellIndex}>
                    <select
                      value={cell}
                      onChange={(e) => handleTypeChange(rowIndex, e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {allowedDataTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                );
              }

              return <td key={cellIndex}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CSVTable;
