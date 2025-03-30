import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';  // Your drag-and-drop component
import InitiateModelButton from './InitiateModelButton';  // Import the InitiateModelButton component

const DragDropBuild = ({
    jsonData,
    setJsonData,
    isJsonValidated,
    handleValidation
    }) => {
    return (
      <div>
        {/* Show the drag-and-drop area */}
        <DragAndDrop setJsonData={setJsonData} handleValidation={handleValidation} />

        {/* Display the "Inspect Model" button, but it's disabled until JSON is validated */}
        <InitiateModelButton 
          jsonData={jsonData} 
          isJsonValidated={isJsonValidated} 
        />
      </div>
    );
  };

export default DragDropBuild;
