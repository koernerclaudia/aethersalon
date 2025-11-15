#!/usr/bin/env node
// Simple script to fetch /api/products and print name + raw.Reihenfolge for inspection.
// Usage: node scripts/check-products-order.js [baseUrl]

const baseUrl = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000';
const endpoint = `${baseUrl.replace(/\/$/, '')}/api/products`;

(async () => {
  try {
    console.log(`Fetching ${endpoint} ...`);
    const res = await fetch(endpoint, { method: 'GET' });
    if (!res.ok) {
      console.error(`Request failed: ${res.status} ${res.statusText}`);
      process.exit(2);
    }

    const json = await res.json();
    const products = Array.isArray(json.products) ? json.products : [];

    if (products.length === 0) {
      console.log('No products returned.');
      process.exit(0);
    }

    console.log(`Returned ${products.length} products:`);
    console.log('idx | name - raw.Reihenfolge - rawId');
    products.forEach((p, i) => {
      const rawOrder = p?.raw?.Reihenfolge ?? p?.raw?.Order ?? 'N/A';
      console.log(`${String(i + 1).padStart(3)} | ${p.name} - ${rawOrder} - ${p.rawId}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error fetching products:', err);
    process.exit(3);
  }
})();
