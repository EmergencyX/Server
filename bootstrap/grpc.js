const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');
const fs = require('fs');

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
		var key_data = fs.readFileSync('server.key');
		var crt_data = fs.readFileSync('server.crt');
        var sslCreds = grpc.ServerCredentials.createSsl(null,
                                                   [{private_key: key_data,
                                                     cert_chain: crt_data}]);
		
		
		console.log(sslCreds);
		server.bind(endpoint, sslCreds);
		server.start();
		return server;
	},
	halt(server) {

	}
}