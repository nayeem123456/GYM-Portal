@echo off
setlocal EnableDelayedExpansion

title GYM Portal - Git Sync Tool v3.0

set "REPO_DIR=%~dp0"
set "REMOTE=origin"
set "BRANCH=main"
set "ERRORS=0"
set "PULLED=0"
set "PUSHED=0"
set "LOG_FILE=%REPO_DIR%sync-log.txt"
set "TMPF=%TEMP%\gym-sync-tmp.txt"

for /f "tokens=*" %%t in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd_HH:mm:ss'"') do set "TIMESTAMP=%%t"
for /f "tokens=*" %%d in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd'"') do set "TODAY=%%d"

cd /d "%REPO_DIR%"

echo.
echo   ============================================================
echo        GYM PORTAL - One-Click Git Sync Tool v3.0
echo        github.com/nayeem123456/GYM-Portal
echo   ============================================================
echo.
echo   Started at: !TIMESTAMP!
echo.

echo   [STEP 1] Checking prerequisites...

where git >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo     [ERROR] Git is NOT installed!
    set /a ERRORS+=1
    goto :report
)
for /f "tokens=*" %%v in ('git --version 2^>nul') do set "GIT_VER=%%v"
echo     [OK] !GIT_VER!

git rev-parse --is-inside-work-tree >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo     [ERROR] Not a git repository!
    set /a ERRORS+=1
    goto :report
)
echo     [OK] Git repository found.

for /f "tokens=*" %%u in ('git config --get remote.origin.url 2^>nul') do set "REMOTE_URL=%%u"
if "!REMOTE_URL!"=="" (
    echo     [ERROR] Remote not configured!
    set /a ERRORS+=1
    goto :report
)
echo     [OK] Remote: !REMOTE_URL!

for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set "CUR_BRANCH=%%b"
if "!CUR_BRANCH!"=="" set "CUR_BRANCH=main"
echo     [OK] Branch: !CUR_BRANCH!

echo.
echo   [STEP 2] Testing GitHub connection...
git ls-remote --exit-code !REMOTE! >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo     [ERROR] Cannot reach GitHub!
    set /a ERRORS+=1
    goto :report
)
echo     [OK] GitHub connection OK.

echo.
echo   [STEP 3] Scanning local workspace...
git status --porcelain > "!TMPF!" 2>nul
set "LOCAL_COUNT=0"
call :countlines LOCAL_COUNT
if !LOCAL_COUNT! GTR 0 (
    echo     [INFO] !LOCAL_COUNT! local changes
    for /f "tokens=*" %%L in ('type "!TMPF!"') do echo       %%L
    echo.
) else (
    echo     [OK] No local changes.
)

echo   [STEP 4] Fetching from GitHub...
git fetch !REMOTE! !BRANCH! >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo     [ERROR] Fetch failed!
    set /a ERRORS+=1
    goto :report
)
echo     [OK] Fetch complete.

set "REMOTE_COUNT=0"
for /f %%n in ('git rev-list HEAD..!REMOTE!/!BRANCH! --count 2^>nul') do set "REMOTE_COUNT=%%n"
if !REMOTE_COUNT! GTR 0 (
    echo     [INFO] !REMOTE_COUNT! new commits on GitHub
    for /f "tokens=*" %%l in ('git log HEAD..!REMOTE!/!BRANCH! --oneline --max-count=8 2^>nul') do echo       - %%l
) else (
    echo     [OK] Up-to-date with GitHub.
)

echo.
echo   [STEP 5] Pulling remote changes...
if !REMOTE_COUNT! EQU 0 goto :skip_pull

set "DID_STASH=0"
if !LOCAL_COUNT! GTR 0 (
    echo     [INFO] Stashing local changes...
    git stash push -m "auto-stash" >nul 2>&1
    set "DID_STASH=1"
    echo     [OK] Stashed.
)
git pull --rebase !REMOTE! !BRANCH! >nul 2>&1
set "PR=!ERRORLEVEL!"
if !PR! NEQ 0 (
    echo     [ERROR] Pull failed!
    git rebase --abort >nul 2>&1
    if "!DID_STASH!"=="1" git stash pop >nul 2>&1
    set /a ERRORS+=1
    goto :report
)
echo     [OK] Pulled !REMOTE_COUNT! commits.
set "PULLED=!REMOTE_COUNT!"
if "!DID_STASH!"=="1" (
    git stash pop >nul 2>&1
    echo     [OK] Stash restored.
)
goto :do_push

:skip_pull
echo     [OK] Nothing to pull.

:do_push
echo.
echo   [STEP 6] Pushing local changes...
git status --porcelain > "!TMPF!" 2>nul
set "NOW_COUNT=0"
call :countlines NOW_COUNT

if !NOW_COUNT! EQU 0 (
    echo     [OK] Nothing to push.
    goto :report
)

git add -A >nul 2>&1

git diff --cached --diff-filter=A --name-only > "!TMPF!" 2>nul
set "S_ADD=0"
call :countlines S_ADD

git diff --cached --diff-filter=M --name-only > "!TMPF!" 2>nul
set "S_MOD=0"
call :countlines S_MOD

git diff --cached --diff-filter=D --name-only > "!TMPF!" 2>nul
set "S_DEL=0"
call :countlines S_DEL

set "MSG=sync: !S_MOD! modified, !S_ADD! added, !S_DEL! deleted [!TODAY!]"
echo     [INFO] !MSG!

git commit -m "!MSG!" >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo     [ERROR] Commit failed!
    set /a ERRORS+=1
    goto :report
)
echo     [OK] Committed.

echo     [INFO] Pushing to GitHub...
git push !REMOTE! !BRANCH! 2>nul
if !ERRORLEVEL! NEQ 0 (
    echo     [ERROR] Push failed!
    set /a ERRORS+=1
    goto :report
)
echo     [OK] Pushed !NOW_COUNT! changes!
set "PUSHED=!NOW_COUNT!"

:report

set "LAST_HASH=n/a"
for /f "tokens=*" %%h in ('git log -1 --format^="%%h" 2^>nul') do set "LAST_HASH=%%h"

echo.
echo   ============================================================
if !ERRORS! EQU 0 (
    echo          SYNC COMPLETED SUCCESSFULLY
) else (
    echo          SYNC COMPLETED WITH !ERRORS! ERRORS
)
echo   ============================================================
echo.
echo     Pulled  : !PULLED! commits from GitHub
echo     Pushed  : !PUSHED! files to GitHub
echo     Branch  : !CUR_BRANCH!
echo     Commit  : !LAST_HASH!
echo     Time    : !TIMESTAMP!
echo.
echo   ============================================================
echo.
if exist "!TMPF!" del "!TMPF!" >nul 2>&1
echo   Press any key to close...
pause >nul
exit /b !ERRORS!

:countlines
set "%~1=0"
if not exist "!TMPF!" goto :eof
for /f "usebackq tokens=*" %%x in ("!TMPF!") do set /a %~1+=1
goto :eof
