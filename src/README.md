# Nginx SSL verify client optional

Below is an example of a docker-compose.yml file that sets up:

1. Two Node.js sample applications: service1 and service2.
2. An Nginx reverse proxy with a self-signed SSL certificate.
3. Nginx configured for SSL client verification (optional).

## Directory Structure

```plaintext
.
├── docker-compose.yml
├── service1/
│   ├── Dockerfile
│   └── app.js
├── service2/
│   ├── Dockerfile
│   └── app.js
├── nginx/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── ssl/
│       ├── server.key
│       ├── server.crt
│       └── ca.crt
```

### docker-compose.yml

```yaml
version: '3.9'
services:
  service1:
    build: ./service1
    container_name: service1
    ports:
      - "3001:3000"

  service2:
    build: ./service2
    container_name: service2
    ports:
      - "3002:3000"

  nginx:
    build: ./nginx
    container_name: nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
```

### service1/Dockerfile and service2/Dockerfile

Both services can use the same Dockerfile:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY app.js .
RUN npm install express
CMD ["node", "app.js"]
```

### service1/app.js and service2/app.js

Basic Node.js Express server:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Service!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### nginx/Dockerfile

```dockerfile
Copy code
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
```

### nginx/nginx.conf

```nginx
events {}

http {
    upstream service1 {
        server service1:3000;
    }

    upstream service2 {
        server service2:3000;
    }

    server {
        listen 443 ssl;

        ssl_certificate /etc/nginx/ssl/server.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;
        ssl_client_certificate /etc/nginx/ssl/ca.crt;
        ssl_verify_client optional;

        location /service1/ {
            proxy_pass http://service1/;
        }

        location /service2/ {
            proxy_pass http://service2/;
        }
    }
}
```

## Generating SSL Certificates

Use OpenSSL to create self-signed certificates:

```bash
mkdir nginx/ssl

# Generate CA key and certificate
openssl genrsa -out nginx//ssl//ca.key 2048
openssl req -x509 -new -nodes -key nginx//ssl//ca.key -sha256 -days 365 -out nginx//ssl//ca.crt -subj "//CN=MyCA"

# Generate server key and certificate signing request (CSR)
openssl genrsa -out nginx//ssl//server.key 2048
openssl req -new -key nginx//ssl//server.key -out nginx//ssl//server.csr -subj "//CN=localhost"

# Sign the server certificate with the CA certificate
openssl x509 -req -in nginx//ssl//server.csr -CA nginx//ssl//ca.crt -CAkey nginx//ssl//ca.key -CAcreateserial -out nginx//ssl//server.crt -days 365 -sha256
```

## Running the Setup

Build and start the services:

```bash
docker-compose up --build
```

## Access the services

- [https://localhost/service1/](https://localhost/service1/)
- [https://localhost/service2/](https://localhost/service2/)
