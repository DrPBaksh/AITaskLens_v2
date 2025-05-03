#!/bin/bash
# Script to build Lambda layer for Python dependencies

set -e

# Constants
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BUILD_DIR="${SCRIPT_DIR}/build"
LAYER_DIR="${BUILD_DIR}/python"
ZIP_FILE="${SCRIPT_DIR}/python-dependencies.zip"

# Cleanup previous build artifacts
rm -rf "${BUILD_DIR}" "${ZIP_FILE}"
mkdir -p "${LAYER_DIR}"

# Install dependencies to the layer directory
echo "Installing dependencies to layer directory..."
pip install -r "${SCRIPT_DIR}/requirements.txt" -t "${LAYER_DIR}" --no-cache-dir

# Remove unnecessary files to reduce size
echo "Cleaning up unnecessary files..."
find "${LAYER_DIR}" -type d -name "__pycache__" -exec rm -rf {} +
find "${LAYER_DIR}" -type d -name "*.dist-info" -exec rm -rf {} +
find "${LAYER_DIR}" -type d -name "*.egg-info" -exec rm -rf {} +
find "${LAYER_DIR}" -type f -name "*.pyc" -delete
find "${LAYER_DIR}" -type f -name "*.pyo" -delete
find "${LAYER_DIR}" -type f -name "*.pyd" -delete

# Create zip file
echo "Creating layer zip file..."
cd "${BUILD_DIR}" && zip -r "${ZIP_FILE}" python/

echo "Layer zip created at: ${ZIP_FILE}"
echo "Layer size: $(du -h "${ZIP_FILE}" | cut -f1)"

echo "Done!"
