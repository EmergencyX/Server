require('dotenv').config();

const Orm = require('./bookshelf');
Orm.User.where('id', 1).fetch({withRelated: ['projects']}).then(function(user) {

  console.log(user.related('projects').toJSON());

}).catch(function(err) {

  console.error(err);

});