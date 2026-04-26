# Script de test API PowerShell
# Exécutez ce script après avoir lancé le serveur

$ApiUrl = "http://localhost:5000/api"
$Token = ""

Write-Host "
╔════════════════════════════════════════════════════╗
║     TESTS DES ENDPOINTS - BOUTIQUE EN LIGNE       ║
╚════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Fonction pour afficher les résultats
function Show-Response {
    param($response, $title)
    Write-Host "`n[$title]" -ForegroundColor Green
    Write-Host "─────────────────────────────────────" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
}

try {
    # Test 1: Health Check
    Write-Host "`n[1] Test Health Check..." -ForegroundColor Yellow
    $health = Invoke-WebRequest -Uri "$ApiUrl/health" -Method Get -ContentType "application/json" | ConvertFrom-Json
    Show-Response $health "Health Check"

    # Test 2: Login et obtenir le token
    Write-Host "`n[2] Test Login (authentification)..." -ForegroundColor Yellow
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json

    $login = Invoke-WebRequest -Uri "$ApiUrl/auth/login" -Method Post `
        -ContentType "application/json" `
        -Body $loginBody | ConvertFrom-Json
    
    Show-Response $login "Login"
    
    # Récupérer le token
    $Token = $login.token
    Write-Host "`n✅ Token obtenu: $($Token.Substring(0, 50))..." -ForegroundColor Green

    # Test 3: Lister tous les produits (public)
    Write-Host "`n[3] Test Lister les Produits (public)..." -ForegroundColor Yellow
    $products = Invoke-WebRequest -Uri "$ApiUrl/products" -Method Get `
        -ContentType "application/json" | ConvertFrom-Json
    
    Show-Response $products "Lister les Produits"

    # Test 4: Récupérer un produit spécifique (public)
    if ($products.data -and $products.data[0]) {
        $productId = $products.data[0]._id
        Write-Host "`n[4] Test Récupérer un Produit (public)..." -ForegroundColor Yellow
        $product = Invoke-WebRequest -Uri "$ApiUrl/products/$productId" -Method Get `
            -ContentType "application/json" | ConvertFrom-Json
        
        Show-Response $product "Détail du Produit"
    }

    # Test 5: Créer un nouveau produit (protégé - admin)
    Write-Host "`n[5] Test Créer un Produit (protégé - admin)..." -ForegroundColor Yellow
    $newProductBody = @{
        nom = "Test Produit - $(Get-Date -Format 'HH:mm:ss')"
        description = "Ceci est un produit de test créé à $(Get-Date)"
        prix = 149.99
        imageURL = "https://via.placeholder.com/400x300?text=Test+Product"
        stock = 25
        categorie = "Test"
    } | ConvertTo-Json

    $newProduct = Invoke-WebRequest -Uri "$ApiUrl/products" -Method Post `
        -ContentType "application/json" `
        -Headers @{"Authorization" = "Bearer $Token"} `
        -Body $newProductBody | ConvertFrom-Json
    
    Show-Response $newProduct "Créer un Produit"

    if ($newProduct.data) {
        $createdProductId = $newProduct.data._id

        # Test 6: Modifier le produit (protégé - admin)
        Write-Host "`n[6] Test Modifier un Produit (protégé - admin)..." -ForegroundColor Yellow
        $updateBody = @{
            prix = 179.99
            stock = 35
        } | ConvertTo-Json

        $updatedProduct = Invoke-WebRequest -Uri "$ApiUrl/products/$createdProductId" -Method Put `
            -ContentType "application/json" `
            -Headers @{"Authorization" = "Bearer $Token"} `
            -Body $updateBody | ConvertFrom-Json
        
        Show-Response $updatedProduct "Modifier un Produit"

        # Test 7: Supprimer le produit (protégé - admin)
        Write-Host "`n[7] Test Supprimer un Produit (protégé - admin)..." -ForegroundColor Yellow
        $deletedProduct = Invoke-WebRequest -Uri "$ApiUrl/products/$createdProductId" -Method Delete `
            -ContentType "application/json" `
            -Headers @{"Authorization" = "Bearer $Token"} | ConvertFrom-Json
        
        Show-Response $deletedProduct "Supprimer un Produit"
    }

    # Test 8: Tester l'accès sans token (doit échouer)
    Write-Host "`n[8] Test Accès sans token (doit échouer)..." -ForegroundColor Yellow
    try {
        $noTokenBody = @{
            nom = "Test sans token"
            description = "Ceci devrait échouer"
            prix = 99
            imageURL = "https://example.com/image.jpg"
        } | ConvertTo-Json

        Invoke-WebRequest -Uri "$ApiUrl/products" -Method Post `
            -ContentType "application/json" `
            -Body $noTokenBody -ErrorAction Stop | ConvertFrom-Json | Out-Null
    } catch {
        Write-Host "Erreur attendue (sans token):" -ForegroundColor Yellow
        Write-Host ($_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5) -ForegroundColor Red
    }

    # Test 9: Tester avec un token invalide (doit échouer)
    Write-Host "`n[9] Test Accès avec token invalide (doit échouer)..." -ForegroundColor Yellow
    try {
        $invalidTokenBody = @{
            nom = "Test token invalide"
            description = "Ceci devrait échouer"
            prix = 99
            imageURL = "https://example.com/image.jpg"
        } | ConvertTo-Json

        Invoke-WebRequest -Uri "$ApiUrl/products" -Method Post `
            -ContentType "application/json" `
            -Headers @{"Authorization" = "Bearer INVALID_TOKEN_12345"} `
            -Body $invalidTokenBody -ErrorAction Stop | ConvertFrom-Json | Out-Null
    } catch {
        Write-Host "Erreur attendue (token invalide):" -ForegroundColor Yellow
        Write-Host ($_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5) -ForegroundColor Red
    }

    Write-Host "`n
╔════════════════════════════════════════════════════╗
║           ✅ TOUS LES TESTS COMPLÉTÉS             ║
╚════════════════════════════════════════════════════╝
" -ForegroundColor Green

} catch {
    Write-Host "`n❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Assurez-vous que le serveur fonctionne sur http://localhost:5000" -ForegroundColor Yellow
}
