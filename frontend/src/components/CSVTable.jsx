import React, { useState, useEffect } from "react";

const CSVTable = ({ csvData, publishTableData }) => {
  const [tableData, setTableData] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const allowedDataTypes = ["string", "number", "boolean", "array", "object"];

  useEffect(() => {
    if (csvData) {
      const rows = csvData.split("\n").map((row) => row.split(","));
      setTableData(rows);
    }
  }, [csvData]);

  const toggleRequired = (rowIndex) => {
    const updatedData = [...tableData];
    updatedData[rowIndex + 1][4] =
      updatedData[rowIndex + 1][4] === "True" ? "False" : "True";
    setTableData(updatedData);
  };

  const handleDefaultChange = (rowIndex, newValue) => {
    const updatedData = [...tableData];
    updatedData[rowIndex + 1][5] = newValue;
    setTableData(updatedData);
  };

  const handleTypeChange = (rowIndex, newValue) => {
    const updatedData = [...tableData];
    updatedData[rowIndex + 1][3] = newValue;  // 'Type' column index is 3
    setTableData(updatedData);
  };

  // Convert tableData into CSV format
  const convertTableDataToCSV = () => {
    return tableData.map(row => row.join(",")).join("\n");
  };

  const handlePublish = async () => {
    try {
      const response = await publishTableData(convertTableDataToCSV());
  
      // Log the response object for debugging
      console.log("Response from backend:", response);
  
      if (response && response.success) {
        alert("Model published successfully!");
      } else {
        const errorMessages = response.errors || ["Unknown error occurred"];
        alert("Validation errors:\n" + errorMessages.join("\n"));
      }
    } catch (err) {
      console.error("Unexpected publish error:", err);
      alert("An unexpected error occurred while publishing.");
    }
  };
  
  return (
    <div>
      {errorMessages.length > 0 && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <ul>
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
      <table>
        <thead>
          <tr>
            {tableData[0] && tableData[0].map((header, index) => 
              header === "uid" ? null : <th key={index}>{header}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                if (cellIndex === 0) return null;
                if (cellIndex === 4) {
                  return (
                    <td key={cellIndex} onClick={() => toggleRequired(rowIndex)} style={{ cursor: "pointer", color: "blue" }}>
                      {cell}
                    </td>
                  );
                }
                if (cellIndex === 5) {
                  return (
                    <td key={cellIndex}>
                      <input type="text" value={cell} onChange={(e) => handleDefaultChange(rowIndex, e.target.value)} />
                    </td>
                  );
                }
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
      
      <button
       onClick={handlePublish}>Publish Model</button>
    </div>
  );
};

export default CSVTable;
