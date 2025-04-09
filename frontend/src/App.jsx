import React, { useState, useEffect } from 'react';
import DragDropBuild from './components/DragDropBuild.jsx';
import CSVTable from "./components/csvTable";
import { buildModel, publishTableData } from './services/api';  // Import publishTableData

const App = () => {
  const [jsonData, setJsonData] = useState(null);  // Stores the JSON data
  const [isJsonValidated, setIsJsonValidated] = useState(false);  // Tracks if JSON is validated
  const [csvData, setCsvData] = useState('');  // Stores the CSV string
  const [metadata, setMetadata] = useState('');

  const handleValidation = (validationResult) => {
    if (validationResult.isValid) {
      setIsJsonValidated(true);
    } else {
      setIsJsonValidated(false);
    }
  };

  useEffect(() => {
    if (jsonData && isJsonValidated) {
      const fetchModelData = async () => {
        try {
          const modelData = await buildModel(jsonData);  // Call the buildModel API
          setCsvData(modelData.data);  // Assuming modelData.data contains the CSV string
          setMetadata();
          console.log("metadata:", modelData)
        } catch (err) {
          console.error("Error building model:", err);
        }
      };
      fetchModelData();
    }
  }, [jsonData, isJsonValidated]);

  return (
    <div>
      <h1>JSON Expydite</h1>
      <DragDropBuild
        jsonData={jsonData}
        setJsonData={setJsonData}
        isJsonValidated={isJsonValidated}
        handleValidation={handleValidation}
      />

      {csvData && <CSVTable csvData={csvData} publishTableData={publishTableData} />}
    </div>
  );
};

export default App;
