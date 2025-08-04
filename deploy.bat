@echo off
cd /d %~dp0
git add .
git commit -m "Deploy latest site update"
git push origin main
pause