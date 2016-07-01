require('dotenv').config();

const grpc = require('grpc');
const smtp = require('smtp-server');
const proto = grpc.load('proto/explorer-server.proto');
const fs = require('fs');

function authorize() {
    return grpc.credentials.createFromMetadataGenerator(function (context, callback) {
        var metadata = new grpc.Metadata();
        metadata.add('authorization', process.env.SMTP_AUTH);
        callback(null, metadata);
    });
}

const grpcClient = new proto.EmergencyExplorerService('localhost:' + process.env.PORT_GRPC,
    grpc.credentials.combineChannelCredentials(grpc.credentials.createSsl(fs.readFileSync('server.crt')), authorize())
);

const smtpServer = new smtp.SMTPServer({
    onAuth(auth, session, callback) {
        if (auth.username !== 'test' || auth.password !== 'test') {
            return callback(new Error('Invalid username or password'));
        }

        //grpcClient.login({username: auth.username, password: auth.password}, function(err, response) {
        //    if (err) {
        //      callback(err);
        //    }
        //    callback(null, {user: response.id'});
        //});

        callback(null, {user: 'test'});
    },
    onConnect(session, callback){
        //if (session.remoteAddress === '127.0.0.1') {
        //    return callback(new Error('No connections from localhost allowed'));
        //}
        console.log(session);
        return callback();
    },
    allowInsecureAuth: true,
    authMethods: ['LOGIN'],
    maxClients: 3
});

smtpServer.on('error', function (err) {
    console.log('Error %s', err.message);
});
smtpServer.listen(process.env.PORT_SMTP, '0.0.0.0', function () {
    console.log('listening')
});