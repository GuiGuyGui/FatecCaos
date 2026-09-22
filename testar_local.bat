@echo off
title OmniVoid Studios - Servidor de Teste Local
echo ========================================================
echo   OMNIVOID STUDIOS - SERVIDOR DE TESTE LOCAL
echo ========================================================
echo.
echo Iniciando servidor local na porta 8000...
echo O site abrira automaticamente no seu navegador padrao!
echo.
echo Para fechar o servidor, basta fechar esta janela preta.
echo.
cd /d "%~dp0docs"
start "" "http://localhost:8000"
python -m http.server 8000
pause
