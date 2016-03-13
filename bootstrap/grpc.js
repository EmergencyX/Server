const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');
const fs = require('fs');

function login(call, callback) {
	console.log('got ', call);
	callback(null, {success: false, user_id: 0});
}

function getServer() {
	const server = new grpc.Server();
	server.addProtoService(proto.EmergencyExplorerService.service, { login });
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