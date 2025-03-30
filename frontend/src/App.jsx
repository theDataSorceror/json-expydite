// frontend/src/App.jsx
import React, { useState } from 'react';
import DragDropBuild from './components/DragDropBuild.jsx';

const App = () => {
  // State management for the JSON and validation status
  const [jsonData, setJsonData] = useState(null);  // Stores the JSON data
  const [isJsonValidated, setIsJsonValidated] = useState(false);  // Tracks if JSON is validated

  // Function to handle the validation of the JSON (could be passed to DragAndDrop)
  const handleValidation = (validationResult) => {
    if (validationResult.isValid) {
      setIsJsonValidated(true);
    } else {
      setIsJsonValidated(false);
    }
  };
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
    </div>
  );
};

export default App;

