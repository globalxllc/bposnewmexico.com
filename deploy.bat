@echo off
cd /d "%~dp0"
echo.
echo -------------------------------------
echo  Starting Auto Git Deploy for bposnewmexico.com
echo -------------------------------------
echo.

git add .
git commit -m "Auto deploy on %date% %time%"
git push origin main

echo.
echo -------------------------------------
echo  Deploy complete! Netlify will rebuild shortly.
echo  Opening live site in browser...
echo -------------------------------------
start https://bposnewmexico.com
