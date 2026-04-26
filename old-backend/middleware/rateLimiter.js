const rateLimits = new Map();

// Configuration de base pour le rate limiting
const defaultRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
};

// Configurations spécifiques par route (plus détaillées)
const routeRateLimits = {
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000,
    max: 10, // Limite stricte pour les tentatives de login
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes'
  },
  '/api/auth/register': {
    windowMs: 60 * 60 * 1000,
    max: 5, // Limite très stricte pour l'inscription
    message: 'Trop d\'inscriptions depuis cette IP, veuillez réessayer dans 1 heure'
  },
  '/api/admin': {
    windowMs: 15 * 60 * 1000,
    max: 50, // Limite moins stricte pour les routes admin
    message: 'Trop de requêtes admin depuis cette IP, veuillez réessayer dans 15 minutes'
  },
  '/api/products/search': {
    windowMs: 15 * 60 * 1000,
    max: 60, // Limite pour la recherche avancée
    message: 'Trop de recherches depuis cette IP, veuillez réessayer dans 15 minutes'
  },
  '/api/products/stats': {
    windowMs: 30 * 60 * 1000,
    max: 20, // Limite stricte pour les statistiques
    message: 'Trop de requêtes de statistiques depuis cette IP, veuillez réessayer dans 30 minutes'
  },
  '/api/products/bulk': {
    windowMs: 60 * 60 * 1000,
    max: 10, // Limite très stricte pour les opérations en masse
    message: 'Trop d\'opérations en masse depuis cette IP, veuillez réessayer dans 1 heure'
  },
  '/api/products': {
    windowMs: 15 * 60 * 1000,
    max: 80, // Limite pour les routes de produits
    message: 'Trop de requêtes sur les produits depuis cette IP, veuillez réessayer dans 15 minutes'
  }
};

// Liste d'IP blanchies (accès illimité)
const whitelistedIPs = process.env.RATE_LIMIT_WHITELIST ? 
  process.env.RATE_LIMIT_WHITELIST.split(',').map(ip => ip.trim()) : [];

// Liste d'IP bannies (accès refusé)
const blacklistedIPs = process.env.RATE_LIMIT_BLACKLIST ? 
  process.env.RATE_LIMIT_BLACKLIST.split(',').map(ip => ip.trim()) : [];

const getRateLimitConfig = (req) => {
  // Vérifier si la route correspond à une configuration spécifique
  for (const [routePattern, config] of Object.entries(routeRateLimits)) {
    if (req.path.startsWith(routePattern)) {
      return config;
    }
  }
  return defaultRateLimit;
};

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  // Vérifier si l'IP est bannie
  if (blacklistedIPs.includes(ip)) {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé depuis cette IP',
      code: 'IP_BLACKLISTED'
    });
  }
  
  // Passer le rate limiting pour les IP blanchies
  if (whitelistedIPs.includes(ip)) {
    return next();
  }
  
  const config = getRateLimitConfig(req);
  
  // Clé unique basée sur IP et route/méthode pour plus de granularité
  const key = `${ip}:${req.method}:${req.path}`;
  
  const now = Date.now();
  
  if (!rateLimits.has(key)) {
    rateLimits.set(key, {
      requests: [],
      windowStart: now,
      windowEnd: now + config.windowMs
    });
  }
  
  const rateLimitData = rateLimits.get(key);
  
  // Réinitialiser la fenêtre si elle a expiré
  if (now > rateLimitData.windowEnd) {
    rateLimitData.requests = [];
    rateLimitData.windowStart = now;
    rateLimitData.windowEnd = now + config.windowMs;
  }
  
  // Ajouter la requête actuelle
  rateLimitData.requests.push(now);
  
  // Supprimer les requêtes anciennes (hors de la fenêtre)
  rateLimitData.requests = rateLimitData.requests.filter(timestamp => 
    timestamp > rateLimitData.windowEnd - config.windowMs
  );
  
  // Vérifier si la limite est atteinte
  if (rateLimitData.requests.length > config.max) {
    const retryAfter = Math.ceil((rateLimitData.windowEnd - now) / 1000);
    
    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', rateLimitData.windowEnd);
    res.setHeader('Retry-After', retryAfter);
    
    return res.status(429).json({
      success: false,
      error: config.message,
      retryAfter: retryAfter,
      resetTime: new Date(rateLimitData.windowEnd),
      code: 'RATE_LIMIT_EXCEEDED',
      limit: config.max,
      window: `${Math.floor(config.windowMs / 1000 / 60)} minutes`
    });
  }
  
  // Ajouter les en-têtes de rate limiting
  res.setHeader('X-RateLimit-Limit', config.max);
  res.setHeader('X-RateLimit-Remaining', config.max - rateLimitData.requests.length);
  res.setHeader('X-RateLimit-Reset', rateLimitData.windowEnd);
  
  // Nettoyer les entrées anciennes périodiquement
  if (Math.random() < 0.01) { // 1% de chance de nettoyer à chaque requête
    for (const [key, data] of rateLimits.entries()) {
      if (now > data.windowEnd) {
        rateLimits.delete(key);
      }
    }
  }
  
  next();
};

// Middleware supplémentaire pour limiter par utilisateur (si authentifié)
const userRateLimiter = (req, res, next) => {
  if (!req.admin) {
    return next();
  }
  
  const config = getRateLimitConfig(req);
  const key = `user:${req.admin.id}:${req.method}:${req.path}`;
  const now = Date.now();
  
  if (!rateLimits.has(key)) {
    rateLimits.set(key, {
      requests: [],
      windowStart: now,
      windowEnd: now + config.windowMs
    });
  }
  
  const rateLimitData = rateLimits.get(key);
  
  if (now > rateLimitData.windowEnd) {
    rateLimitData.requests = [];
    rateLimitData.windowStart = now;
    rateLimitData.windowEnd = now + config.windowMs;
  }
  
  rateLimitData.requests.push(now);
  rateLimitData.requests = rateLimitData.requests.filter(timestamp => 
    timestamp > rateLimitData.windowEnd - config.windowMs
  );
  
  if (rateLimitData.requests.length > config.max) {
    const retryAfter = Math.ceil((rateLimitData.windowEnd - now) / 1000);
    
    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', rateLimitData.windowEnd);
    res.setHeader('Retry-After', retryAfter);
    
    return res.status(429).json({
      success: false,
      error: 'Trop de requêtes depuis votre compte, veuillez réessayer plus tard',
      retryAfter: retryAfter,
      resetTime: new Date(rateLimitData.windowEnd),
      code: 'USER_RATE_LIMIT_EXCEEDED',
      limit: config.max,
      window: `${Math.floor(config.windowMs / 1000 / 60)} minutes`
    });
  }
  
  res.setHeader('X-RateLimit-Limit', config.max);
  res.setHeader('X-RateLimit-Remaining', config.max - rateLimitData.requests.length);
  res.setHeader('X-RateLimit-Reset', rateLimitData.windowEnd);
  
  next();
};

// Exporter les middlewares
module.exports = {
  rateLimiter,
  userRateLimiter,
  getRateLimitConfig
};
