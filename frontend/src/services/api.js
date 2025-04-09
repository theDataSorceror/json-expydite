import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const validateJSON = async (jsonData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/validate`, { data: jsonData });
        return response.data;
    } catch (error) {
        throw new Error("Error during validation");
    }
};

export const buildModel = async (jsonData) => {
    try {
        let response;
        console.log(jsonData)
        if (Array.isArray(jsonData)) {
            console.log("Detected an array. Sending as an array.");
            response = await fetch(`${API_BASE_URL}/buildModelArray`, {  // Separate endpoint for arrays
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( jsonData ),
            });
        } else if (typeof jsonData === "object" && jsonData !== null) {
            console.log("Detected an object. Sending as an object.");
            response = await fetch(`${API_BASE_URL}/buildModelObject`, {  // Separate endpoint for objects
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: jsonData }),
            });
        } else {
            throw new Error("Invalid JSON input: Must be an object or an array.");
        }

        console.log("Full Response Headers:", response.headers);
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        throw new Error("Error building model");
    }
};

export const publishTableData = async (csvString) => {
    try {
      const response = await fetch(`${API_BASE_URL}/publishTableData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Updated to match the expected response
        },
        body: JSON.stringify({ csvData: csvString }), // Wrap CSV string in a JSON object
      });
  
      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`Failed to publish model: ${response.statusText}`);
      }
  
      // Parse the JSON response from the backend
      const responseData = await response.json();
      console.log(responseData); // Log response to debug
      console.log(responseData.metadata)
      return responseData; // Return the parsed JSON response
    } catch (error) {
      console.error("Publish failed:", error);
      throw error; // Re-throw error to be handled in the calling function
    }
  };