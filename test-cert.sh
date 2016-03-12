cert:
    openssl genrsa -des3 -out server.enc.key 1024
    openssl req -new -key server.enc.key -out server.csr
    openssl rsa -in server.enc.key -out server.key
    openssl x509 -req -days 7 -in server.csr -signkey server.key -out server.crt