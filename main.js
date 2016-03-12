require('dotenv').config();

const server = require('bootstrap/grpc');

server.run('0.0.0.0:50051');
console.log('running');
