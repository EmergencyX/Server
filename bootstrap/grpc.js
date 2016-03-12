const grpc = require('grpc');
const proto = grpc.load('../proto/explorer-server.js');

function sayHello(call, callback) {
	console.log('got ', call);
	callback(null, {success: false, user_id: 0});
}

function getServer() {
	var server = new grpc.Server();
	server.addProtoService(proto.EmergencyExplorerService.service, { loginRequest });
	return server;
}

module.exports = {
	run(endpoint) {
		const server = getServer();
		server.bind(endpoint, grpc.ServerCredentials.createInsecure());
		server.listen();
		return server;
	},
	halt(server) {

	}
}