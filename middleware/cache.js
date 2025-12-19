const NodeCache = require('node-cache');

// Create cache instance with 10 minutes TTL (Time To Live)
const cache = new NodeCache({ 
  stdTTL: 600, // 10 minutes default
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Better performance
});

// Middleware to cache GET requests
const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`✅ Cache HIT for: ${key}`);
      return res.json(cachedResponse);
    }

    console.log(`❌ Cache MISS for: ${key}`);
    
    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (body) => {
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};

// Clear cache for specific pattern
const clearCache = (pattern) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
      console.log(`🗑️ Cleared cache for: ${key}`);
    }
  });
};

// Clear all cache
const clearAllCache = () => {
  cache.flushAll();
  console.log('🗑️ All cache cleared');
};

// Get cache stats
const getCacheStats = () => {
  return cache.getStats();
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache,
  getCacheStats,
  cache
};
