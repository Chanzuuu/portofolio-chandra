@echo off
title Auto Deploy Portofolio ke GitHub - Chanzuuu
echo ================================================================
echo       MENGHUBUNGKAN DAN MEN-DEPLOY PORTOFOLIO KE GITHUB
echo                  Akun: https://github.com/Chanzuuu
echo ================================================================
echo.
echo Menyiapkan path Git...
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"

echo.
echo Menjalankan git push ke repository: portofolio-chandra...
echo Jika muncul jendela login browser, silakan klik 'Sign in with your browser'.
echo.
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ================================================================
    echo [SUKSES!] Portofolio berhasil di-push ke GitHub!
    echo Auto Deploy GitHub Pages sedang memproses website Anda di:
    echo https://chanzuuu.github.io/portofolio-chandra/
    echo ================================================================
) else (
    echo [INFO] Jika login belum selesai, Anda bisa login menggunakan GitHub CLI:
    echo gh auth login
)
echo.
pause

