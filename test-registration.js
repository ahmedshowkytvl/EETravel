import http from 'http';

const testData = JSON.stringify({
  username: 'testuser123',
  email: 'testuser123@example.com',
  password: 'test123456',
  fullName: 'Test User'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Failed to parse JSON response');
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.write(testData);
req.end();

console.log('Testing registration endpoint...');
console.log('Sending data:', testData);