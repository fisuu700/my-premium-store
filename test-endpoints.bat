@echo off
REM Script de test des endpoints API
REM Assurez-vous que le serveur fonctionne sur http://localhost:5000

setlocal enabledelayedexpansion

set API_URL=http://localhost:5000/api
set TOKEN=

echo.
echo ====================================================
echo TEST API - BOUTIQUE EN LIGNE
echo ====================================================
echo.

REM Test 1: Health check
echo [1] Test Health Check...
curl -X GET "%API_URL%/health"
echo.
echo.

REM Test 2: Login et obtenir le token
echo [2] Test Login (obtenir token)...
for /f "tokens=*" %%A in ('curl -s -X POST "%API_URL%/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}" ^
  ^| findstr /R "token"') do (
  set TOKEN_LINE=%%A
)
echo %TOKEN_LINE%
echo.
echo Copiez le token pour les tests suivants
echo.

REM Test 3: Lister les produits (public)
echo [3] Test Lister Produits (public)...
curl -X GET "%API_URL%/products" ^
  -H "Content-Type: application/json"
echo.
echo.

REM Test 4: Créer un produit (protégé - besoin du token)
echo [4] Test Créer Produit (protégé - remplacez TOKEN par le vrai token)...
echo Utilisez cette commande dans PowerShell:
echo.
echo $token = "VOTRE_TOKEN_ICI"
echo $body = @{
echo   nom = "Test Produit"
echo   description = "Description test"
echo   prix = 99.99
echo   imageURL = "https://example.com/image.jpg"
echo   stock = 10
echo   categorie = "Test"
echo } ^| ConvertTo-Json
echo.
echo Invoke-WebRequest -Uri "http://localhost:5000/api/products" ^
echo   -Method Post ^
echo   -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} ^
echo   -Body $body
echo.

pause
