const https = require('https');

const options = {
  hostname: 'localhost',
  port: 443,
  path: '/service1/', // or /service2/
  method: 'GET', // or POST, PUT, DELETE, etc.
  rejectUnauthorized: false, // Disable SSL verification
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.end();
