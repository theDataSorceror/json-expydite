// frontend/src/components/DragAndDrop.jsx
import React, { useState } from 'react';
import { validateJSON } from '../services/api';  // Assume this function validates the JSON

const DragAndDrop = ({ setJsonData, handleValidation }) => {
  const [status, setStatus] = useState(null);  // Track the status (e.g., received, validated, error)
  const [fileName, setFileName] = useState("");  // Track the file name for confirmation

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];  // Get the first file dropped

    if (file && file.type === "application/json") {
      setFileName(file.name);  // Store the file name for display
      setStatus("Received");  // Update status to indicate file is received

      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const jsonContent = JSON.parse(reader.result);  // Parse the JSON file
          setJsonData(jsonContent);  // Update jsonData in App.jsx
          console.log(jsonContent)
          // Validate the JSON via the backend
          const validationResult = await validateJSON(jsonContent);
          handleValidation(validationResult);  // Update the validation status in App.jsx
          console.log(validationResult.isValid)
          if (validationResult.isValid) {
            setStatus("Valid JSON");  // Update status to indicate the JSON is valid
          } else {
            setStatus("Invalid JSON");  // Update status to indicate invalid JSON
          }

        } catch (error) {
          console.error('Invalid JSON file');
        }
      };

      reader.onerror = () => {
        console.error('Error reading the file');
      };

      reader.readAsText(file);  // Read the file as text
    }
  };

return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ border: '2px dashed #ccc', padding: '20px', width: '300px' }}
    >
      <p>Drag and drop a JSON file here.</p>

      {/* Show the status message or confirmation */}
      {status && <p><strong>Status:</strong> {status}</p>}

      {/* Optionally, display the file name */}
      {fileName && <p><strong>File: </strong>{fileName}</p>}
    </div>
  );
};

export default DragAndDrop;
