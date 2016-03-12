const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');
const fs = require('fs');

var client = new proto.EmergencyExplorerService('localhost:50051', grpc.credentials.createSsl(
    fs.readFileSync('server.crt'))
);
client.login({username: 'user', password: 'secret'}, function(err, response) {
    console.log(response);
});