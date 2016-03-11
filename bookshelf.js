const knex = require('knex')({
	client: 'mysql', 
	connection: {
		host     : process.env.DB_HOST,
		user     : process.env.DB_USERNAME,
		password : process.env.DB_PASSWORD,
		database : process.env.DB_DATABASE,
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