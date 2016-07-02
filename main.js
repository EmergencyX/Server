require('dotenv').config();

const logger = require('./bootstrap/logger');

const server = require('./bootstrap/grpc');

server.run('0.0.0.0:50051');
logger.info('running');


/*
const Orm = require('./bookshelf');
Orm.User.where('id', 1).fetch({withRelated: ['projects']}).then(function(user) {

  console.log(user.related('projects').toJSON());

}).catch(function(err) {

  console.error(err);

});
*/