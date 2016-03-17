'use strict';
const orm = require('../bootstrap/bookshelf');
const bcrypt = require('twin-bcrypt');
const cipher = require('../lib/cipher');

module.exports = {
    login(call, callback) {
	    orm.User.where('name', call.request.username).fetch({required:true}).then(function(user) {
            let success = bcrypt.compareSync(call.request.password, user.get('password'));
            
            let token;
            if (success && call.request.remember_me) {
                token = cipher.encrypt(JSON.stringify({user_id: user.id, token: user.get('remember_token')}));
            }
            
            callback(null, {success, user_id: success ? user.id : 0, token});
        }).catch(function(err) {
            console.log(err);
            callback(null, {success: false, user_id: 0});
        });
    },
    loginWithToken(call, callback) {
	    orm.User.where('id', call.request.user_id).fetch({required:true}).then(function(user) {
            let token = JSON.parse(cipher.decrypt(call.request.token));
            let success = (user.id === token.user_id) && (token.token === user.get('remember_token'));

            callback(null, {success, user_id: success ? user.id : 0});
        }).catch(function(err) {
            console.log(err);
            callback(null, {success: false, user_id: 0});
        });
    }
}