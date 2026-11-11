@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

:: ═══════════════════════════════════════════════════════════════════════
::  GYM PORTAL — One-Click Git Sync Tool v2.0
::  Repository: https://github.com/nayeem123456/GYM-Portal
::  Double-click this file to sync local ↔ remote automatically.
:: ═══════════════════════════════════════════════════════════════════════

title GYM Portal — Git Sync Tool v2.0

:: ─── Configuration ───────────────────────────────────────────────────
set "REPO_DIR=%~dp0"
set "REMOTE_NAME=origin"
set "BRANCH=main"
set "TIMESTAMP=%date:~-4%-%date:~4,2%-%date:~7,2% %time:~0,8%"
set "ERRORS=0"
set "PULLED=0"
set "PUSHED=0"
set "LOG_FILE=%REPO_DIR%sync-log.txt"

:: ─── Colors via PowerShell helper ────────────────────────────────────
:: We use PowerShell to print colored lines since cmd color is limited
goto :start

:print_header
powershell -Command "Write-Host ''; Write-Host '  ╔══════════════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '  ║        GYM PORTAL — One-Click Git Sync Tool v2.0           ║' -ForegroundColor Cyan; Write-Host '  ║   github.com/nayeem123456/GYM-Portal                       ║' -ForegroundColor Cyan; Write-Host '  ╚══════════════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host ''"
goto :eof

:print_step
powershell -Command "Write-Host '  [STEP] ' -NoNewline -ForegroundColor Yellow; Write-Host '%~1' -ForegroundColor White"
goto :eof

:print_ok
powershell -Command "Write-Host '    ✓ ' -NoNewline -ForegroundColor Green; Write-Host '%~1' -ForegroundColor Gray"
goto :eof

:print_info
powershell -Command "Write-Host '    ℹ ' -NoNewline -ForegroundColor Cyan; Write-Host '%~1' -ForegroundColor Gray"
goto :eof

:print_warn
powershell -Command "Write-Host '    ⚠ ' -NoNewline -ForegroundColor Yellow; Write-Host '%~1' -ForegroundColor Yellow"
goto :eof

:print_err
powershell -Command "Write-Host '    ✗ ' -NoNewline -ForegroundColor Red; Write-Host '%~1' -ForegroundColor Red"
goto :eof

:print_divider
powershell -Command "Write-Host '  ──────────────────────────────────────────────────────────────' -ForegroundColor DarkGray"
goto :eof

:print_success_banner
powershell -Command "Write-Host ''; Write-Host '  ╔══════════════════════════════════════════════════════════════╗' -ForegroundColor Green; Write-Host '  ║              ✓  SYNC COMPLETED SUCCESSFULLY  ✓              ║' -ForegroundColor Green; Write-Host '  ╚══════════════════════════════════════════════════════════════╝' -ForegroundColor Green"
goto :eof

:print_fail_banner
powershell -Command "Write-Host ''; Write-Host '  ╔══════════════════════════════════════════════════════════════╗' -ForegroundColor Red; Write-Host '  ║              ✗  SYNC FINISHED WITH ERRORS  ✗               ║' -ForegroundColor Red; Write-Host '  ╚══════════════════════════════════════════════════════════════╝' -ForegroundColor Red"
goto :eof

:: ═══════════════════════════════════════════════════════════════════════
:start
:: ═══════════════════════════════════════════════════════════════════════

call :print_header
echo   Started at: %TIMESTAMP%
echo.

:: Log start
echo [%TIMESTAMP%] ═══ Sync started ═══ >> "%LOG_FILE%"

:: ─── STEP 1: Verify Prerequisites ───────────────────────────────────
call :print_step "Verifying prerequisites..."

:: Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    call :print_err "Git is NOT installed or not in PATH!"
    call :print_err "Download from: https://git-scm.com/downloads"
    set /a ERRORS+=1
    goto :final_report
)
for /f "tokens=*" %%v in ('git --version') do set "GIT_VERSION=%%v"
call :print_ok "Git found: !GIT_VERSION!"

:: Check if we're inside a git repository
cd /d "%REPO_DIR%"
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    call :print_err "This folder is NOT a git repository!"
    call :print_err "Run 'git init' first, then add a remote."
    set /a ERRORS+=1
    goto :final_report
)
call :print_ok "Git repository detected."

:: Check if remote exists
git remote get-url %REMOTE_NAME% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    call :print_err "Remote '%REMOTE_NAME%' not found!"
    call :print_err "Run: git remote add origin https://github.com/nayeem123456/GYM-Portal.git"
    set /a ERRORS+=1
    goto :final_report
)
for /f "tokens=*" %%u in ('git remote get-url %REMOTE_NAME%') do set "REMOTE_URL=%%u"
call :print_ok "Remote: !REMOTE_URL!"

:: Check current branch
for /f "tokens=*" %%b in ('git branch --show-current') do set "CURRENT_BRANCH=%%b"
if "!CURRENT_BRANCH!"=="" (
    call :print_warn "Detached HEAD state. Switching to %BRANCH%..."
    git checkout %BRANCH% >nul 2>&1
    set "CURRENT_BRANCH=%BRANCH%"
)
call :print_ok "Branch: !CURRENT_BRANCH!"

:: Check internet connectivity to GitHub
call :print_info "Testing connection to GitHub..."
git ls-remote --exit-code %REMOTE_NAME% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    call :print_err "Cannot connect to GitHub! Check your internet or credentials."
    set /a ERRORS+=1
    goto :final_report
)
call :print_ok "GitHub connection OK."

call :print_divider
echo.

:: ─── STEP 2: Check for Local Changes ────────────────────────────────
call :print_step "Scanning local workspace for changes..."

:: Count modified/new/deleted files
set "LOCAL_CHANGES=0"
for /f %%c in ('git status --porcelain ^| find /c /v ""') do set "LOCAL_CHANGES=%%c"

if !LOCAL_CHANGES! GTR 0 (
    call :print_info "Found !LOCAL_CHANGES! changed file(s) locally:"
    echo.
    :: Show a compact summary of changes (max 20 files)
    set "SHOWN=0"
    for /f "tokens=1,* delims= " %%a in ('git status --porcelain') do (
        set /a SHOWN+=1
        if !SHOWN! LEQ 20 (
            set "STATUS=%%a"
            set "FNAME=%%b"
            if "!STATUS!"=="M" (
                powershell -Command "Write-Host '      Modified:  ' -NoNewline -ForegroundColor Yellow; Write-Host '%%b' -ForegroundColor White"
            ) else if "!STATUS!"=="??" (
                powershell -Command "Write-Host '      New file:  ' -NoNewline -ForegroundColor Green; Write-Host '%%b' -ForegroundColor White"
            ) else if "!STATUS!"=="D" (
                powershell -Command "Write-Host '      Deleted:   ' -NoNewline -ForegroundColor Red; Write-Host '%%b' -ForegroundColor White"
            ) else if "!STATUS!"=="A" (
                powershell -Command "Write-Host '      Added:     ' -NoNewline -ForegroundColor Green; Write-Host '%%b' -ForegroundColor White"
            ) else (
                powershell -Command "Write-Host '      Changed:   ' -NoNewline -ForegroundColor Magenta; Write-Host '%%b' -ForegroundColor White"
            )
        )
    )
    if !LOCAL_CHANGES! GTR 20 (
        set /a REMAINING=!LOCAL_CHANGES!-20
        call :print_info "... and !REMAINING! more file(s)"
    )
    echo.
) else (
    call :print_ok "No local changes detected. Workspace is clean."
)

echo [%TIMESTAMP%] Local changes: !LOCAL_CHANGES! >> "%LOG_FILE%"

call :print_divider
echo.

:: ─── STEP 3: Fetch Remote & Check for Updates ───────────────────────
call :print_step "Fetching latest from GitHub..."

git fetch %REMOTE_NAME% %BRANCH% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    call :print_err "Failed to fetch from remote!"
    set /a ERRORS+=1
    goto :final_report
)
call :print_ok "Fetch complete."

:: Compare local vs remote
set "REMOTE_CHANGES=0"
for /f %%c in ('git rev-list HEAD..%REMOTE_NAME%/%BRANCH% --count 2^>nul') do set "REMOTE_CHANGES=%%c"

if !REMOTE_CHANGES! GTR 0 (
    call :print_info "Found !REMOTE_CHANGES! new commit(s) on GitHub that you don't have."
    echo.
    :: Show remote commits
    powershell -Command "Write-Host '      Recent remote commits:' -ForegroundColor Cyan"
    for /f "tokens=*" %%l in ('git log HEAD..%REMOTE_NAME%/%BRANCH% --oneline --max-count=10') do (
        powershell -Command "Write-Host '        → %%l' -ForegroundColor DarkCyan"
    )
    echo.
) else (
    call :print_ok "Local is up-to-date with GitHub. No remote changes."
)

echo [%TIMESTAMP%] Remote changes: !REMOTE_CHANGES! commits >> "%LOG_FILE%"

call :print_divider
echo.

:: ─── STEP 4: Pull Remote Changes (if any) ───────────────────────────
if !REMOTE_CHANGES! GTR 0 (
    call :print_step "Pulling remote changes into local workspace..."

    :: If there are local changes, stash them first
    if !LOCAL_CHANGES! GTR 0 (
        call :print_info "Stashing your local changes temporarily..."
        git stash push -m "auto-stash-before-sync-%date:~-4%%date:~4,2%%date:~7,2%" >nul 2>&1
        if !ERRORLEVEL! NEQ 0 (
            call :print_err "Failed to stash local changes!"
            set /a ERRORS+=1
            goto :final_report
        )
        call :print_ok "Local changes safely stashed."
        set "STASHED=1"
    ) else (
        set "STASHED=0"
    )

    :: Pull with rebase to keep history clean
    git pull --rebase %REMOTE_NAME% %BRANCH% 2>&1
    if !ERRORLEVEL! NEQ 0 (
        call :print_err "Pull/Rebase failed! There may be conflicts."
        call :print_warn "Aborting rebase to restore safe state..."
        git rebase --abort >nul 2>&1
        if "!STASHED!"=="1" (
            git stash pop >nul 2>&1
        )
        set /a ERRORS+=1
        goto :final_report
    )
    call :print_ok "Pulled !REMOTE_CHANGES! commit(s) successfully."
    set "PULLED=!REMOTE_CHANGES!"

    :: Restore stashed changes if we stashed earlier
    if "!STASHED!"=="1" (
        call :print_info "Restoring your stashed local changes..."
        git stash pop >nul 2>&1
        if !ERRORLEVEL! NEQ 0 (
            call :print_err "Conflict while restoring local changes!"
            call :print_warn "Your changes are still in stash. Run 'git stash pop' manually."
            set /a ERRORS+=1
            goto :final_report
        )
        call :print_ok "Local changes restored."
    )

    echo [%TIMESTAMP%] Pulled !REMOTE_CHANGES! commits >> "%LOG_FILE%"
) else (
    call :print_step "No remote changes to pull. Skipping."
    call :print_ok "Already up-to-date."
)

call :print_divider
echo.

:: ─── STEP 5: Stage, Commit & Push Local Changes ─────────────────────
:: Re-check for local changes (could have changed after stash pop)
set "LOCAL_CHANGES_NOW=0"
for /f %%c in ('git status --porcelain ^| find /c /v ""') do set "LOCAL_CHANGES_NOW=%%c"

if !LOCAL_CHANGES_NOW! GTR 0 (
    call :print_step "Staging and committing !LOCAL_CHANGES_NOW! local change(s)..."

    :: Stage all changes
    git add -A >nul 2>&1
    if !ERRORLEVEL! NEQ 0 (
        call :print_err "Failed to stage files!"
        set /a ERRORS+=1
        goto :final_report
    )
    call :print_ok "All changes staged."

    :: Generate a smart commit message
    set "ADDED=0"
    set "MODIFIED=0"
    set "DELETED=0"
    for /f %%a in ('git diff --cached --numstat ^| find /c /v ""') do set "TOTAL_STAGED=%%a"
    for /f %%a in ('git diff --cached --diff-filter=A --name-only ^| find /c /v ""') do set "ADDED=%%a"
    for /f %%a in ('git diff --cached --diff-filter=M --name-only ^| find /c /v ""') do set "MODIFIED=%%a"
    for /f %%a in ('git diff --cached --diff-filter=D --name-only ^| find /c /v ""') do set "DELETED=%%a"

    set "COMMIT_MSG=sync: !MODIFIED! modified, !ADDED! added, !DELETED! deleted [auto-sync %date:~-4%-%date:~4,2%-%date:~7,2%]"

    git commit -m "!COMMIT_MSG!" >nul 2>&1
    if !ERRORLEVEL! NEQ 0 (
        call :print_err "Commit failed!"
        set /a ERRORS+=1
        goto :final_report
    )
    call :print_ok "Committed: !COMMIT_MSG!"

    :: Push to remote
    call :print_step "Pushing changes to GitHub..."
    git push %REMOTE_NAME% %BRANCH% 2>&1
    if !ERRORLEVEL! NEQ 0 (
        call :print_err "Push failed! Check your GitHub credentials or permissions."
        set /a ERRORS+=1
        goto :final_report
    )
    call :print_ok "Pushed successfully to %REMOTE_NAME%/%BRANCH%."
    set "PUSHED=!LOCAL_CHANGES_NOW!"

    echo [%TIMESTAMP%] Pushed !LOCAL_CHANGES_NOW! file changes >> "%LOG_FILE%"
) else (
    call :print_step "No local changes to push. Skipping."
    call :print_ok "Nothing to commit."
)

call :print_divider
echo.

:: ═══════════════════════════════════════════════════════════════════════
:final_report
:: ═══════════════════════════════════════════════════════════════════════

:: Get final commit info
for /f "tokens=*" %%h in ('git log -1 --format^="%%h" 2^>nul') do set "LAST_HASH=%%h"
for /f "tokens=*" %%m in ('git log -1 --format^="%%s" 2^>nul') do set "LAST_MSG=%%m"
for /f "tokens=*" %%d in ('git log -1 --format^="%%cr" 2^>nul') do set "LAST_DATE=%%d"

if !ERRORS! EQU 0 (
    call :print_success_banner
) else (
    call :print_fail_banner
)

echo.
powershell -Command "Write-Host '  ┌─────────────────── SYNC SUMMARY ───────────────────┐' -ForegroundColor White"
powershell -Command "Write-Host '  │                                                     │' -ForegroundColor White"

if !ERRORS! EQU 0 (
    powershell -Command "Write-Host '  │  Status:       ' -NoNewline -ForegroundColor White; Write-Host '✓ SUCCESS                          ' -NoNewline -ForegroundColor Green; Write-Host '│' -ForegroundColor White"
) else (
    powershell -Command "Write-Host '  │  Status:       ' -NoNewline -ForegroundColor White; Write-Host '✗ ERRORS (!ERRORS!)                        ' -NoNewline -ForegroundColor Red; Write-Host '│' -ForegroundColor White"
)

powershell -Command "Write-Host '  │  Pulled:       !PULLED! commit(s) from GitHub              │' -ForegroundColor White"
powershell -Command "Write-Host '  │  Pushed:       !PUSHED! file(s) to GitHub                  │' -ForegroundColor White"
powershell -Command "Write-Host '  │  Branch:       !CURRENT_BRANCH!                                   │' -ForegroundColor White"
powershell -Command "Write-Host '  │  Last Commit:  !LAST_HASH! — !LAST_DATE!            │' -ForegroundColor White"
powershell -Command "Write-Host '  │                                                     │' -ForegroundColor White"
powershell -Command "Write-Host '  └─────────────────────────────────────────────────────┘' -ForegroundColor White"
echo.

:: Log end
echo [%TIMESTAMP%] ═══ Sync complete (Errors: !ERRORS!, Pulled: !PULLED!, Pushed: !PUSHED!) ═══ >> "%LOG_FILE%"
echo.

:: Wait for user to see the result
if !ERRORS! GTR 0 (
    powershell -Command "Write-Host '  Check the errors above and fix them before re-running.' -ForegroundColor Yellow"
    echo.
)

powershell -Command "Write-Host '  Press any key to close...' -ForegroundColor DarkGray"
pause >nul
exit /b !ERRORS!
