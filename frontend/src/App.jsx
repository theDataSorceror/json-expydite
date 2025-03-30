import React, { useState, useEffect } from 'react';
import DragDropBuild from './components/DragDropBuild.jsx';
import CSVTable from "./components/csvTable";
import { buildModel } from './services/api';  // Import the buildModel function

const App = () => {
  // State management for the JSON, validation, and CSV data
  const [jsonData, setJsonData] = useState(null);  // Stores the JSON data
  const [isJsonValidated, setIsJsonValidated] = useState(false);  // Tracks if JSON is validated
  const [csvData, setCsvData] = useState('');  // Stores the CSV string

  // Function to handle the validation of the JSON
  const handleValidation = (validationResult) => {
    if (validationResult.isValid) {
      setIsJsonValidated(true);
    } else {
      setIsJsonValidated(false);
    }
  };

  // Automatically trigger buildModel when jsonData is validated
  useEffect(() => {
    if (jsonData && isJsonValidated) {
      const fetchModelData = async () => {
        try {
          const modelData = await buildModel(jsonData);  // Call the buildModel API
          setCsvData(modelData.data);  // Assuming modelData.data contains the CSV string
        } catch (err) {
          console.error("Error building model:", err);
        }
      };
      fetchModelData();
    }
  }, [jsonData, isJsonValidated]);  // Trigger the effect when jsonData or isJsonValidated changes

  return (
    <div>
      <h1>JSON Expydite</h1>
      {/* Pass the state and handler functions to the child component */}
      <DragDropBuild
        jsonData={jsonData}
        setJsonData={setJsonData}
        isJsonValidated={isJsonValidated}
        handleValidation={handleValidation}
      />
      
      {/* Display the CSV Table if we have CSV data */}
      {csvData && <CSVTable csvData={csvData} />}
    </div>
  );
};

export default App;
