# Project Setup Guide

## Prerequisites
Ensure you have the following installed on your system:
- Python 3.12
- Node.js (latest LTS version recommended)
- npm or yarn
- Git

---

## Backend Setup

### 1. Create a Virtual Environment
Navigate to the backend directory and run the following command to create a Python 3.12 virtual environment:

```bash
python3.12 -m venv backend/venv
```

### 2. Activate the Virtual Environment
- On macOS/Linux:
  ```bash
  source backend/venv/bin/activate
  ```
- On Windows (PowerShell):
  ```powershell
  backend\venv\Scripts\Activate
  ```

### 3. Install Dependencies
Run the provided installation script:

```bash
bash backend/install_all_dependencies
```

Alternatively, you can install dependencies manually:

```bash
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 4. Run the Backend Server
Start the backend server using:

```bash
python backend/main.py  
```

---

## Frontend Setup

### 1. Navigate to the Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```


### 3. Start the Frontend Development Server

Using npm:
```bash
npm run dev
```


This will start the frontend on a local development server, accessible at `http://localhost:5173`.

---

## Additional Notes
- Ensure both the backend and frontend servers are running simultaneously for full functionality.
- If using a `.env` file, ensure all required environment variables are properly set.
- If any issues arise, check the logs for debugging and ensure all dependencies are installed correctly.

Happy coding!

