
# Generating SSL Certificates

Use OpenSSL to create self-signed certificates:

```bash
mkdir nginx/ssl
```

## Generate CA key and certificate

```bash
openssl genrsa -out nginx//ssl//ca.key 2048
openssl req -x509 -new -nodes -key nginx//ssl//ca.key -sha256 -days 365 -out nginx//ssl//ca.crt -subj "//CN=MyCA"
```

## Generate server key and certificate signing request (CSR)

```bash
openssl genrsa -out nginx//ssl//server.key 2048
openssl req -new -key nginx//ssl//server.key -out nginx//ssl//server.csr -subj "//CN=localhost"
```

## Sign the server certificate with the CA certificate

```bash
openssl x509 -req -in nginx//ssl//server.csr -CA nginx//ssl//ca.crt -CAkey nginx//ssl//ca.key -CAcreateserial -out nginx//ssl//server.crt -days 365 -sha256
```
