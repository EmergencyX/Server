"use strict";

require('dotenv').config();

const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');
const fs = require('fs');


function getMetaGeneratorCredentials() {
    return grpc.credentials.createFromMetadataGenerator(function (auth_context, callback) {
        "use strict";
        console.log(auth_context);
        var metadata = new grpc.Metadata();
        metadata.add('authorization', "hello world");
        callback(null, metadata);
    });
}


var client = new proto.EmergencyExplorerService('beta.emergencyx.de:50051',
    grpc.credentials.combineChannelCredentials(grpc.credentials.createSsl(fs.readFileSync('server.crt')), getMetaGeneratorCredentials())
);

/*
 client.login({username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD}, function (err, response) {
 console.log('login#remember_me=false', response);
 });

 client.login({
 username: process.env.TEST_USERNAME,
 password: process.env.TEST_PASSWORD,
 remember_me: true
 }, function (err, response) {
 console.log('login#remember_me=true', response);
 client.loginWithToken({user_id: response.user_id, token: response.token}, function (err, response) {
 console.log('loginWithToken', response);
 });
 });

 client.projectList({}, function (err, response) {
 console.log(err);
 console.log(JSON.stringify(response, null, 4));
 });
 */

client.getMedia({id: 1, size: 1}, function (err, response) {
    console.log(err);
    console.log(JSON.stringify(response, null, 4));

    fs.writeFileSync('test-image-copy.jpg', response.content);
});