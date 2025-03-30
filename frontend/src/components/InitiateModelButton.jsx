// frontend/src/components/InitiateModelButton.jsx
import React, { useState } from 'react';
import { buildModel } from '../services/api';

const InitiateModelButton = ({ jsonData, isJsonValidated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(isJsonValidated)
  const handleClick = async () => {
    console.log("Button clicked with jsonData:", jsonData);
    if (!jsonData) {
      setError("No valid JSON to send!");
      return;
    }
    console.log("clicked")
    setIsLoading(true);

    try {
      const modelData = await buildModel(jsonData);  // API call to backend
      console.log("Model Data:", modelData);  // Use the returned model data as needed
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Failed to initiate model. Please try again.");
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Button is disabled until the JSON is validated */}
      <button onClick={handleClick} disabled={!isJsonValidated || isLoading}>
        {isLoading ? "Processing..." : "Build Model"}
      </button>
    </div>
  );
};

export default InitiateModelButton;
