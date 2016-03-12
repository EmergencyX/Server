const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');

function login(call, callback) {
	console.log('got ', call);
	callback(null, {success: false, user_id: 0});
}

function getServer() {
	var server = new grpc.Server();
	server.addProtoService(proto.EmergencyExplorerService.service, { login });
	return server;
}

module.exports = {
	run(endpoint) {
		var server = getServer();
		server.bind(endpoint, grpc.ServerCredentials.createSsl());
		server.start();
		return server;
	},
	halt(server) {

	}
}