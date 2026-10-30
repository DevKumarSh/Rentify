@echo off
setlocal

:: Ensure Windows system directories and PowerShell are in PATH
set "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;%SystemRoot%;%PATH%"

echo ====================================================
echo Starting RentiFy Backend (Spring Boot + Embedded DB)
echo ====================================================

:: Check if Java is installed
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java is not detected in your PATH.
    echo Please ensure Java 17 or Java 21 JDK is installed.
    echo You can download it from: https://adoptium.net/
    pause
    exit /b 1
)

echo Java detected! Launching application...
call "%~dp0mvnw.cmd" spring-boot:run

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Backend failed to start.
    pause
)
