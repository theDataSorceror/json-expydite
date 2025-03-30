import React from 'react';
import DragAndDrop from './DragAndDrop';

const DragDropBuild = ({
  jsonData,
  setJsonData,
  isJsonValidated,
  handleValidation,
}) => {
  return (
    <div>
      {/* Show the drag-and-drop area */}
      <DragAndDrop
        setJsonData={setJsonData}
        handleValidation={handleValidation}
      />
      
      {/* Show validation status */}
      {isJsonValidated && jsonData ? (
        <p>JSON is valid and ready for further processing.</p>
      ) : (
        <p>Please upload a valid JSON file.</p>
      )}
    </div>
  );
};

export default DragDropBuild;