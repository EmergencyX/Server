'use strict';
const orm = require('../bootstrap/bookshelf');
const bcrypt = require('twin-bcrypt');

module.exports = {
    login(call, callback) {
	    orm.User.where('name', call.request.username).fetch({required:true}).then(function(user) {
            let success = bcrypt.compareSync(call.request.password, user.get('password'));
            callback(null, {success, user_id: success ? user.id : 0});
        }).catch(function(err) {
            console.log(err);
            callback(null, {success: false, user_id: 0});
        });
    }
}