#!/bin/bash

# Navigate to the backend directory
echo "Installing dependencies from requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Installation complete. To activate the virtual environment, run:"
echo "source backend/venv/bin/activate"  # Adjust path if needed
