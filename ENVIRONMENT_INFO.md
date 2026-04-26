# Informations Environnement & Diagnostique

## Configuration système

### Node.js & npm
```
Node.js:       v24.11.1
npm:           11.6.2
OS:            Windows 10 (Build 26200)
Architecture:  x64
```

### npm Configuration actuelle
```bash
# Afficher config
npm config list
npm config get registry
```

---

## Verrou Installation

### État du node_modules

**Packages installés complètement:** 4/6
```
✓ express@4.22.1
✓ dotenv@16.6.1
✓ jsonwebtoken@9.0.3
✓ bcryptjs@2.4.3
✓ axios@1.13.2
```

**Packages incomplets:** 2/8
```
⚠ mongoose (core manquante)
⚠ nodemon (core manquante)
```

**Dépendances transitives présentes:** ~100+ modules

---

## Diagnostique de Connectivité

### Vérifier la connexion à npm registry

```bash
# Test 1: Ping registry
npm ping

# Test 2: Récupérer infos package
npm view express version

# Test 3: Configuration proxy (si derrière)
npm config get proxy
npm config get https-proxy
```

### Si erreur ETIMEDOUT:

**Étape 1: Vérifier connectivité générale**
```bash
ping registry.npmjs.org
ping github.com
```

**Étape 2: Augmenter timeout**
```bash
npm config set fetch-timeout 120000
npm install
```

**Étape 3: Utiliser registre alternatif**
```bash
# Registry chinois (rapide)
npm config set registry https://registry.npmmirror.com

# Registry taobao
npm config set registry https://registry.taobao.org

# Retour au registry officiel
npm config set registry https://registry.npmjs.org/
```

**Étape 4: Forcer réinstallation**
```bash
npm install --force
npm ci --force
```

---

## Commandes de Récupération

### Réinitialisation complète (solution nucléaire)

```bash
# 1. Arrêter tout processus npm
taskkill /im node.exe /f
taskkill /im npm.exe /f

# 2. Nettoyer complètement
del /s /q node_modules
del package-lock.json
del yarn.lock (si existe)

# 3. Nettoyer cache npm
npm cache clean --force

# 4. Vérifier package.json est valide
npm ls

# 5. Réinstaller depuis zéro
npm install --verbose
```

### Installation progressive par dépendance

```bash
# Installer chaque package individuellement
npm install express@^4.18.2
npm install mongoose@^7.0.0
npm install dotenv@^16.0.3
npm install jsonwebtoken@^9.0.0
npm install bcryptjs@^2.4.3
npm install axios@^1.3.0

# Dev dependencies
npm install --save-dev nodemon@^2.0.20
```

### Vérification pas à pas

```bash
# Après chaque install, vérifier:
npm ls --depth=0
npm audit
node -e "require('express'); console.log('✓ Express OK')"
node -e "require('mongoose'); console.log('✓ Mongoose OK')"
```

---

## Commandes utiles

```bash
# Afficher arbre des dépendances
npm ls --all

# Afficher seulement les packages directs
npm ls --depth=0

# Vérifier les vulnerabilités
npm audit

# Fixer les vulnerabilités
npm audit fix

# Afficher les packages obsolètes
npm outdated

# Mettre à jour les packages
npm update

# Mettre à jour un package spécifique
npm install package-name@latest
```

---

## Fichiers de configuration npm

### .npmrc (à créer si besoin)
```
registry=https://registry.npmjs.org/
fetch-timeout=120000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
legacy-peer-deps=true
```

### package.json - À vérifier
```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

---

## Status de Santé

### ✅ Points forts
- Node.js v24 (très récent)
- npm v11 (stable)
- Windows compatible
- 4/6 packages de production OK
- Structure de projet valide

### ⚠️ Points à surveiller
- Mongoose/Nodemon incomplete
- Problème de timeout réseau
- Possible proxy/firewall bloquant npm
- node_modules partiel peut causer erreurs

---

## Si le projet doit démarrer IMMÉDIATEMENT

**Solution de contournement:**

1. Installer uniquement les packages production critiques:
```bash
npm install --no-save express mongoose dotenv jsonwebtoken bcryptjs axios
```

2. Démarrer en mode production (pas de nodemon):
```bash
npm start  # au lieu de npm run dev
```

3. Installer nodemon plus tard:
```bash
npm install --save-dev nodemon  # Quand la connexion est meilleure
```

---

## Support & Escalade

### Logs à vérifier
```
%APPDATA%\npm-cache\_logs\
```

### Logs npm détaillés
```bash
npm install --loglevel=silly > install.log 2>&1
```

### Vérifier proxy corporatif
```bash
npm config list
npm config get proxy
npm config get https-proxy
```

Si derrière proxy:
```bash
npm config set proxy [protocol://][user[:password]@]proxyhost[:8080]
npm config set https-proxy [protocol://][user[:password]@]proxyhost:[port]
```

---

## Prochaines actions recommandées

1. **Vérifier connectivité internet** vers npm registry
2. **Essayer augmenter timeout** à 120s
3. **Basculer sur registre alternatif** si timeout persiste
4. **Réinstaller mongoose et nodemon** individuellement
5. **Vérifier package.json syntax** avec `npm ls`
6. **Contacter admin réseau** si proxy bloque npm

---

**Document généré:** 29 Jan 2026  
**Intention:** Diagnostique et récupération installation npm
