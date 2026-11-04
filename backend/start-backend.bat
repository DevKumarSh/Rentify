@echo off
setlocal enabledelayedexpansion

:: Prioritize Windows System & PowerShell in PATH
set "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;%SystemRoot%;%PATH%"

:: Remove Git\usr\bin from PATH to avoid MSYS2 crash (0xC0000022)
set "PATH=!PATH:C:\Program Files\Git\usr\bin;=!"
set "PATH=!PATH:;C:\Program Files\Git\usr\bin=!"
set "PATH=!PATH:C:\Program Files\Git\usr\bin=!"

echo ====================================================
echo Starting RentiFy Backend (Spring Boot + Embedded DB)
echo Running on: http://localhost:8081/api
echo H2 Console: http://localhost:8081/h2-console
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

:: Prefer installed mvn if available, otherwise use wrapper
where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    mvn spring-boot:run
) else (
    call "%~dp0mvnw.cmd" spring-boot:run
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Backend failed to start.
    pause
)
