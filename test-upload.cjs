const fs = require('fs');

async function testUpload() {
  try {
    const fileData = fs.readFileSync('package.json');
    const blob = new Blob([fileData], { type: 'application/json' });
    
    // Polyfill FormData for Node if needed, but fetch in Node 18+ has FormData
    const formData = new FormData();
    formData.append('file', blob, 'package.json');
    
    const res = await fetch('http://localhost:3000/api/documents', {
      method: 'POST',
      body: formData
    });
    
    const text = await res.text();
    console.log('HTTP Status:', res.status);
    console.log('Response:', text.substring(0, 500));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testUpload();
