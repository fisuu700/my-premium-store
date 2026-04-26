const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

const allowedMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'OPTIONS'
];

const allowedHeaders = [
  'Origin',
  'X-Requested-With',
  'Content-Type',
  'Accept',
  'Authorization',
  'X-CSRF-Token'
];

const exposedHeaders = [
  'X-RateLimit-Limit',
  'X-RateLimit-Remaining',
  'X-RateLimit-Reset',
  'Retry-After'
];

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Vérifier si l'origine est autorisée
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (origin) {
    // Pour les origines non autorisées, on peut soit bloquer, soit autoriser
    // Dans ce cas, on bloque (commenter la ligne ci-dessous pour autoriser toutes les origines)
    return res.status(403).json({
      success: false,
      error: 'Origine non autorisée'
    });
  }
  
  // En-têtes de contrôle CORS
  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
  res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(', '));
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache les pré-vérifications OPTIONS pour 24h
  
  // Pré-vérification OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

module.exports = corsMiddleware;
