# NodeJS Example

To make an HTTPS request in Node.js while disabling SSL verification (similar to what Postman allows), you can use the https module or libraries like axios. Disabling SSL verification is typically used for development or testing, as it bypasses secure checks. However, you should never use this in production because it exposes you to significant security risks.

Here’s how you can achieve this:

## Using the https Module

```javascript
const https = require('https');

const options = {
  hostname: 'example.com',
  port: 443,
  path: '/api/endpoint',
  method: 'GET', // or POST, PUT, DELETE, etc.
  headers: {
    'Content-Type': 'application/json',
  },
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
```

## Using Axios with SSL Verification Disabled

You can configure Axios to bypass SSL verification by setting the httpsAgent option with rejectUnauthorized: false.

```javascript
const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Disable SSL verification
});

axios
  .get('https://example.com/api/endpoint', { httpsAgent })
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
```

## Notes

Security Risk: Disabling SSL verification means your application will accept any certificate, including potentially malicious ones.
Environment-Specific: Use this approach only in development or controlled environments where security is not a concern.
Toggle with Environment Variables: For a safer approach, use environment variables to control whether SSL verification is enabled.

Example:

```javascript
const rejectUnauthorized = process.env.NODE_ENV !== 'development';
const httpsAgent = new https.Agent({ rejectUnauthorized });
```

This ensures SSL verification is only disabled in development environments.
