@echo off
cd %USERPROFILE%\Documents\bposnewmexico.com
git add .
git commit -m "Deploy expanded site with both videos and data section"
git push origin main
pause
