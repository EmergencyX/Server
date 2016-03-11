const knex = require('knex')({
	client: 'mysql', 
	connection: {
		host     : '127.0.0.1',
		user     : '',
		password : '',
		database : '',
		charset  : 'utf8'
	}
});
const bookshelf = require('bookshelf')(knex);

const User = bookshelf.Model.extend({
  tableName: 'users',
  projects: function() {
    return this.belongsToMany(Project);
  }
});

const Project = bookshelf.Model.extend({
  tableName: 'projects',
  users: function() {
    return this.belongsToMany(User);
  }
});

module.exports = {User, Project};