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
        const response = await fetch(`${API_BASE_URL}/buildModel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: jsonData }),
        });

        console.log("Full Response Headers:", response.headers);
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("CORS or API Error:", error);
        throw new Error("Error building model");
    }
};
