@echo off
setlocal EnableDelayedExpansion
title GYM Portal - Git Sync Tool
color 0A

:MENU
cls
echo ========================================================
echo            GYM PORTAL - GIT SYNC TOOL
echo ========================================================
echo Repository: https://github.com/nayeem123456/GYM-Portal.git
echo Branch    : main
echo ========================================================
echo.
echo Please choose an action:
echo.
echo   [1] PUSH  - Stage all changes, commit, and push to GitHub
echo   [2] PULL  - Pull latest updates from GitHub
echo   [3] STATUS- Check current repository status
echo   [4] EXIT  - Close this window
echo.
echo ========================================================
set /p choice="Enter your choice (1/2/3/4 or PUSH/PULL): "

if /i "%choice%"=="1" goto PUSH_FLOW
if /i "%choice%"=="push" goto PUSH_FLOW
if /i "%choice%"=="p" goto PUSH_FLOW

if /i "%choice%"=="2" goto PULL_FLOW
if /i "%choice%"=="pull" goto PULL_FLOW

if /i "%choice%"=="3" goto STATUS_FLOW
if /i "%choice%"=="status" goto STATUS_FLOW
if /i "%choice%"=="s" goto STATUS_FLOW

if /i "%choice%"=="4" goto EXIT_FLOW
if /i "%choice%"=="exit" goto EXIT_FLOW
if /i "%choice%"=="q" goto EXIT_FLOW

echo.
echo [ERROR] Invalid choice. Please enter 1, 2, 3, or 4.
timeout /t 2 >nul
goto MENU

:PUSH_FLOW
cls
echo ========================================================
echo                   PUSHING TO GITHUB
echo ========================================================
echo.
set /p commitMsg="Enter commit message (Press Enter for default message): "
if "%commitMsg%"=="" (
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
    set commitMsg=Update GYM Portal project [!mydate! !mytime!]
)

echo.
echo [*] Staging all files...
git add -A

echo [*] Committing changes with message: "!commitMsg!"
git commit -m "!commitMsg!"

echo [*] Pushing to origin main...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] Changes pushed to GitHub successfully!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo [FAILED] Push failed. Check your network or GitHub credentials.
    echo ========================================================
)
echo.
pause
goto MENU

:PULL_FLOW
cls
echo ========================================================
echo                  PULLING FROM GITHUB
echo ========================================================
echo.
echo [*] Pulling latest changes from origin main...
git pull origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] Project updated from GitHub successfully!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo [FAILED] Pull failed. Please resolve conflicts or check network.
    echo ========================================================
)
echo.
pause
goto MENU

:STATUS_FLOW
cls
echo ========================================================
echo                 GIT REPOSITORY STATUS
echo ========================================================
echo.
git status
echo.
pause
goto MENU

:EXIT_FLOW
echo.
echo Goodbye!
timeout /t 1 >nul
exit /b 0
