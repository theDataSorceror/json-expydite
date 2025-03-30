import React, { useState } from 'react';

const DragAndDrop = ({ setJsonData, handleValidation }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
    console.log("Drag enter");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
    console.log("Drag leave");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];

    // Log the file info for debugging
    console.log("File dropped:", file);

    if (!file) {
      console.error("No file detected in drop event.");
      setError("No file detected.");
      return;
    }

    if (file.type !== 'application/json') {
      console.error("Dropped file is not a valid JSON file. Type:", file.type);
      setError("Please drop a valid JSON file.");
      handleValidation({ isValid: false });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        // Parse the JSON content of the file
        const parsedJson = JSON.parse(reader.result);
        console.log("Parsed JSON:", parsedJson);

        // Set the JSON data to parent state and notify parent of validation success
        setJsonData(parsedJson);  // Update the parent state with the parsed JSON
        handleValidation({ isValid: true });

        // Clear any previous error states
        setError(null);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        setError("Invalid JSON file. Please check the file format.");
        handleValidation({ isValid: false });
      }
    };

    reader.onerror = (err) => {
      console.error("FileReader error:", err);
      setError("Error reading the file.");
      handleValidation({ isValid: false });
    };

    reader.readAsText(file);
  };

  return (
    <div
      style={{
        border: '2px dashed #cccccc',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: isDragging ? '#f0f0f0' : '#fff',
      }}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()} // To allow drop event
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>Drag and Drop a JSON File</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && <p>Drag and drop a JSON file here to validate and process.</p>}
    </div>
  );
};

export default DragAndDrop;
