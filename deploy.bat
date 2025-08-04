@echo off
cd %USERPROFILE%\Documents\bposnewmexico.com
git add .
git commit -m "Deploy iframe-based site fix"
git push origin main
pause
