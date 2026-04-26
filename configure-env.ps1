# Script de configuration interactive du .env
# Executez avec: powershell -ExecutionPolicy Bypass -File configure-env.ps1

Write-Host "`n=== CONFIGURATION DU FICHIER .env ===" -ForegroundColor Cyan
Write-Host "Boutique en Ligne - Backend`n" -ForegroundColor Cyan

# Chemin du fichier .env
$envFile = Join-Path $PSScriptRoot ".env"

# Menu principal
Write-Host "Quelle configuration voulez-vous?" -ForegroundColor Yellow
Write-Host "1. Configuration rapide (MongoDB local)" -ForegroundColor White
Write-Host "2. Configuration complète (MongoDB Atlas)" -ForegroundColor White
Write-Host "3. Configuration personnalisée" -ForegroundColor White
Write-Host "4. Afficher la configuration actuelle" -ForegroundColor White
Write-Host "5. Quitter" -ForegroundColor White

$choice = Read-Host "`nChoisissez (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`nConfiguration rapide - MongoDB Local" -ForegroundColor Green
        $envContent = @"
# MongoDB Configuration - Local
MONGODB_URI=mongodb://localhost:27017/online-store

# JWT Secret Key (Generated)
JWT_SECRET=3d1e9073740b6932e33a55d740f77ff49d37b7061f81b2fb119f2d8fffb79336

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Facebook Graph API (Optional)
FACEBOOK_PAGE_ID=
FACEBOOK_TOKEN=

# Server Configuration
PORT=5000
NODE_ENV=development
"@
        $envContent | Out-File -FilePath $envFile -Encoding UTF8
        Write-Host "Configuration rapide appliquée!" -ForegroundColor Green
        Write-Host "Fichier: $envFile" -ForegroundColor Yellow
    }

    "2" {
        Write-Host "`nConfiguration MongoDB Atlas" -ForegroundColor Green
        
        $mongoUri = Read-Host "Entrez votre MongoDB Atlas URI"
        $jwtSecret = Read-Host "Entrez votre JWT Secret [Appuyez sur Entree pour la cle par defaut]"
        if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
            $jwtSecret = "3d1e9073740b6932e33a55d740f77ff49d37b7061f81b2fb119f2d8fffb79336"
        }
        
        $adminUser = Read-Host "Username admin [appuyez sur Entree pour 'admin']"
        if ([string]::IsNullOrWhiteSpace($adminUser)) { $adminUser = "admin" }
        
        $adminPass = Read-Host "Password admin [appuyez sur Entree pour 'admin123']"
        if ([string]::IsNullOrWhiteSpace($adminPass)) { $adminPass = "admin123" }
        
        $facebookPageId = Read-Host "Facebook Page ID [Optionnel, appuyez sur Entree si non disponible]"
        $facebookToken = Read-Host "Facebook Token [Optionnel, appuyez sur Entree si non disponible]"
        
        $port = Read-Host "Port du serveur [appuyez sur Entree pour 5000]"
        if ([string]::IsNullOrWhiteSpace($port)) { $port = "5000" }
        
        $nodeEnv = Read-Host "Environnement [development/production, appuyez sur Entree pour 'development']"
        if ([string]::IsNullOrWhiteSpace($nodeEnv)) { $nodeEnv = "development" }
        
        $envContent = @"
# MongoDB Configuration - Atlas
MONGODB_URI=$mongoUri

# JWT Secret Key
JWT_SECRET=$jwtSecret

# Admin Credentials
ADMIN_USERNAME=$adminUser
ADMIN_PASSWORD=$adminPass

# Facebook Graph API
FACEBOOK_PAGE_ID=$facebookPageId
FACEBOOK_TOKEN=$facebookToken

# Server Configuration
PORT=$port
NODE_ENV=$nodeEnv
"@
        $envContent | Out-File -FilePath $envFile -Encoding UTF8
        Write-Host "`nConfiguration appliquée!" -ForegroundColor Green
        Write-Host "Fichier: $envFile" -ForegroundColor Yellow
    }

    "3" {
        Write-Host "`nConfiguration personnalisée" -ForegroundColor Green
        
        $mongoUri = Read-Host "MongoDB URI"
        $jwtSecret = Read-Host "JWT Secret"
        $adminUser = Read-Host "Admin Username"
        $adminPass = Read-Host "Admin Password"
        $facebookPageId = Read-Host "Facebook Page ID [Optionnel]"
        $facebookToken = Read-Host "Facebook Token [Optionnel]"
        $port = Read-Host "Port [defaut: 5000]"
        $nodeEnv = Read-Host "Environnement [defaut: development]"
        
        if ([string]::IsNullOrWhiteSpace($port)) { $port = "5000" }
        if ([string]::IsNullOrWhiteSpace($nodeEnv)) { $nodeEnv = "development" }
        
        $envContent = @"
# MongoDB Configuration
MONGODB_URI=$mongoUri

# JWT Secret Key
JWT_SECRET=$jwtSecret

# Admin Credentials
ADMIN_USERNAME=$adminUser
ADMIN_PASSWORD=$adminPass

# Facebook Graph API
FACEBOOK_PAGE_ID=$facebookPageId
FACEBOOK_TOKEN=$facebookToken

# Server Configuration
PORT=$port
NODE_ENV=$nodeEnv
"@
        $envContent | Out-File -FilePath $envFile -Encoding UTF8
        Write-Host "`nConfiguration personnalisée appliquée!" -ForegroundColor Green
        Write-Host "Fichier: $envFile" -ForegroundColor Yellow
    }

    "4" {
        Write-Host "`nConfiguration actuelle:" -ForegroundColor Green
        Write-Host "─────────────────────────────────────" -ForegroundColor Gray
        if (Test-Path $envFile) {
            Get-Content $envFile | ForEach-Object {
                if ($_ -match "^#") {
                    Write-Host $_ -ForegroundColor Gray
                } elseif ($_ -match "PASSWORD|TOKEN|SECRET|URI") {
                    $parts = $_ -split '='
                    $key = $parts[0]
                    Write-Host "$key=***" -ForegroundColor Yellow
                } else {
                    Write-Host $_ -ForegroundColor White
                }
            }
        } else {
            Write-Host "Fichier .env non trouvé!" -ForegroundColor Red
        }
    }

    "5" {
        Write-Host "`nConfiguration annulée" -ForegroundColor Yellow
        exit
    }

    default {
        Write-Host "`nChoix invalide" -ForegroundColor Red
        exit
    }
}

Write-Host "`n=== Configuration complète! ===" -ForegroundColor Green
Write-Host "Fichier .env mis a jour!" -ForegroundColor Green

Write-Host "`nProchaines etapes:`n" -ForegroundColor Yellow
Write-Host "1. Verifier que MongoDB fonctionne" -ForegroundColor White
Write-Host "2. Lancer le serveur: npm start" -ForegroundColor White
Write-Host "3. Tester les endpoints: npm test" -ForegroundColor White

Write-Host "`nConsultez ENV_SETUP_GUIDE.md pour plus de details" -ForegroundColor Gray
