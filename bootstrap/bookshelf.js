const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        charset: 'utf8'
    },
    debug: true
});
const bookshelf = require('bookshelf')(knex);

const User = bookshelf.Model.extend({
    tableName: 'users',
    projects: function () {
        return this.belongsToMany(Project, 'project_user').withPivot(['role']);
    }
});

const Project = bookshelf.Model.extend({
    tableName: 'projects',
    users: function () {
        return this.belongsToMany(User, 'project_user').withPivot(['role']);
    }
});

const Media = bookshelf.Model.extend({
    tableName: 'media'
});

module.exports = {User, Project, Media};