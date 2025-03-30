#!/bin/bash

# Define project name
PROJECT_NAME="json-expydite"

# Create root directory and move into it
mkdir -p $PROJECT_NAME && cd $PROJECT_NAME

echo "Setting up FastAPI backend..."

# Create backend directory structure
mkdir -p backend/app
mkdir -p backend/app/{models,routes,services,utils}
touch backend/{main.py,requirements.txt}
touch backend/app/{__init__.py,models.py,routes.py,services.py,utils.py}

# Populate requirements.txt
echo -e "fastapi\nuvicorn\npydantic" > backend/requirements.txt

# Populate main.py
cat <<EOL > backend/main.py
from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="JSON Expydite API")

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOL

# Populate routes.py
cat <<EOL > backend/app/routes.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class JSONInput(BaseModel):
    data: Dict[str, Any]

@router.post("/validate/")
async def validate_json(input_data: JSONInput):
    return {"message": "JSON received", "data": input_data.dict()}
EOL

echo "Backend setup complete."

echo "Setting up React frontend..."

# Create frontend directory inside the project
mkdir -p frontend

# Initialize Vite React project inside the frontend directory
cd frontend
npm create vite@latest . --template react --force  # Force avoids prompts
npm install
npm install axios

# Create src/services directory
mkdir -p src/services

# Create API service file
cat <<EOL > src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const validateJSON = async (jsonData) => {
    const response = await axios.post(\`\${API_BASE_URL}/validate/\`, { data: jsonData });
    return response.data;
};
EOL

# Replace App.jsx with project-specific content
cat <<EOL > src/App.jsx
import { useState } from "react";
import { validateJSON } from "./services/api";

function App() {
    const [jsonData, setJsonData] = useState("");
    const [response, setResponse] = useState(null);

    const handleValidate = async () => {
        try {
            const res = await validateJSON(JSON.parse(jsonData));
            setResponse(res);
        } catch (error) {
            console.error("Invalid JSON or API error", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl">JSON Mapper PoC</h1>
            <textarea 
                value={jsonData} 
                onChange={(e) => setJsonData(e.target.value)}
                rows="5"
                className="border p-2 w-full"
                placeholder="Paste JSON here..."
            />
            <button onClick={handleValidate} className="mt-2 bg-blue-500 text-white p-2 rounded">Validate JSON</button>
            {response && <pre className="mt-4 p-2 border">{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
}

export default App;
EOL

echo "Frontend setup complete."

echo "Project structure created successfully!"
