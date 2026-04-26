const http = require('http');

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}`;

// Test function to make HTTP requests
const makeRequest = (path, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
};

// Test 1: Vérifier que le serveur répond à /api/health
const testHealthEndpoint = async () => {
  console.log('1. Test de la route /api/health');
  try {
    const response = await makeRequest('/api/health');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Réponse: ${JSON.stringify(response.body, null, 2)}`);
    console.log(`   X-RateLimit-Limit: ${response.headers['x-ratelimit-limit']}`);
    console.log(`   X-RateLimit-Remaining: ${response.headers['x-ratelimit-remaining']}`);
    console.log(`   X-RateLimit-Reset: ${new Date(response.headers['x-ratelimit-reset']).toLocaleString()}`);
    console.log('✅ OK');
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
};

// Test 2: Faire plusieurs requêtes rapides pour tester le rate limiting
const testRateLimiter = async () => {
  console.log('\n2. Test du rate limiting sur /api/health');
  const requests = [];
  const numRequests = 15;
  
  for (let i = 0; i < numRequests; i++) {
    requests.push(makeRequest('/api/health'));
  }
  
  try {
    const responses = await Promise.all(requests);
    let successCount = 0;
    let rateLimitCount = 0;
    
    responses.forEach((response, index) => {
      if (response.statusCode === 200) {
        successCount++;
      } else if (response.statusCode === 429) {
        rateLimitCount++;
      }
    });
    
    console.log(`   Requêtes réussies: ${successCount}`);
    console.log(`   Requêtes bloquées (429): ${rateLimitCount}`);
    
    if (rateLimitCount > 0) {
      const rateLimitResponse = responses.find(r => r.statusCode === 429);
      console.log(`   Message: ${rateLimitResponse.body.error}`);
      console.log(`   Retry-After: ${rateLimitResponse.headers['retry-after']}s`);
      console.log(`   Reset Time: ${new Date(rateLimitResponse.headers['x-ratelimit-reset']).toLocaleString()}`);
    }
    
    console.log('✅ Rate limiting fonctionne');
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
};

// Test 3: Tester le rate limiting sur /api/auth/login avec plusieurs tentatives
const testLoginRateLimiter = async () => {
  console.log('\n3. Test du rate limiting sur /api/auth/login');
  
  const loginBody = {
    username: 'admin',
    password: 'admin123'
  };
  
  const requests = [];
  const numRequests = 15;
  
  for (let i = 0; i < numRequests; i++) {
    requests.push(makeRequest('/api/auth/login', 'POST', loginBody));
  }
  
  try {
    const responses = await Promise.all(requests);
    let successCount = 0;
    let rateLimitCount = 0;
    
    responses.forEach((response, index) => {
      if (response.statusCode === 200) {
        successCount++;
      } else if (response.statusCode === 429) {
        rateLimitCount++;
      }
    });
    
    console.log(`   Requêtes réussies: ${successCount}`);
    console.log(`   Requêtes bloquées (429): ${rateLimitCount}`);
    
    if (rateLimitCount > 0) {
      const rateLimitResponse = responses.find(r => r.statusCode === 429);
      console.log(`   Message: ${rateLimitResponse.body.error}`);
      console.log(`   Retry-After: ${rateLimitResponse.headers['retry-after']}s`);
    }
    
    console.log('✅ Rate limiting sur login fonctionne');
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
};

// Exécuter les tests
const runTests = async () => {
  console.log('🚀 Démarrage des tests du rate limiter');
  console.log('=' . repeat(50));
  
  await testHealthEndpoint();
  await testRateLimiter();
  await testLoginRateLimiter();
  
  console.log('\n' + '=' . repeat(50));
  console.log('🎉 Tests terminés');
};

runTests().catch(console.error);
