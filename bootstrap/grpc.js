const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');
const rpc = require('../rpc/explorer-server');
const fs = require('fs');

function getServer() {
	const server = new grpc.Server();
	server.addProtoService(proto.EmergencyExplorerService.service, rpc);
	return server;
}

function getSslCredentials() {
    return grpc.ServerCredentials.createSsl(null, [{
        private_key: fs.readFileSync('server.key'), 
        cert_chain: fs.readFileSync('server.crt')
    }]);
}

module.exports = {
	run(endpoint) {
		const server = getServer();
		server.bind(endpoint, getSslCredentials());
		server.start();
		return server;
	},
	halt(server) {

	}
}