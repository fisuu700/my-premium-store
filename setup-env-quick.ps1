# Configuration rapide du .env
# Configuration locale MongoDB pour developpement

$envContent = @"
# MongoDB Configuration - Local
MONGODB_URI=mongodb://localhost:27017/online-store

# JWT Secret Key
JWT_SECRET=3d1e9073740b6932e33a55d740f77ff49d37b7061f81b2fb119f2d8fffb79336

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Facebook Graph API - Optionnel
FACEBOOK_PAGE_ID=
FACEBOOK_TOKEN=

# Server Configuration
PORT=5000
NODE_ENV=development
"@

$envFile = Join-Path $PSScriptRoot ".env"
$envContent | Out-File -FilePath $envFile -Encoding UTF8 -Force

Write-Host "Configuration .env appliquee!" -ForegroundColor Green
Write-Host "Fichier: $envFile" -ForegroundColor Yellow
Write-Host "`nConfiguration rapide MongoDB Local" -ForegroundColor Green
Write-Host "`nProchaines etapes:" -ForegroundColor Yellow
Write-Host "1. npm install (si non fait)" -ForegroundColor White
Write-Host "2. npm start (lancer le serveur)" -ForegroundColor White
Write-Host "3. npm test (tester les endpoints)" -ForegroundColor White
