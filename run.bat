@echo off
echo =========================================
echo       Starting Nexus 2100 App
echo =========================================

if not exist node_modules (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
)

echo [INFO] Starting Vite development server...
call npm run dev
