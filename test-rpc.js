const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');

var client = new proto.EmergencyExplorerService('localhost:50051', grpc.credentials.createSsl());
client.login({username: 'user', password: 'secret'}, function(err, response) {
    console.log(response);
});