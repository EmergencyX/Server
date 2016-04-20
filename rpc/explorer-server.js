'use strict';
const orm = require('../bootstrap/bookshelf');
const bcrypt = require('twin-bcrypt');
const cipher = require('../lib/cipher');
const grpc = require('grpc');
const proto = grpc.load('proto/explorer-server.proto');

module.exports = {
    login(call, callback) {
        console.log(call);
        orm.User.where('name', call.request.username).fetch({required: true}).then(function (user) {
            let success = bcrypt.compareSync(call.request.password, user.get('password'));

            let token;
            if (success && call.request.remember_me) {
                token = cipher.encrypt(JSON.stringify({user_id: user.id, token: user.get('remember_token')}));
            }

            callback(null, {success, user_id: success ? user.id : 0, token});
        }).catch(function (err) {
            console.log(err);
            callback(null, {success: false, user_id: 0});
        });
    },
    loginWithToken(call, callback) {
        orm.User.where('id', call.request.user_id).fetch({required: true}).then(function (user) {
            let token = JSON.parse(cipher.decrypt(call.request.token));
            let success = (user.id === token.user_id) && (token.token === user.get('remember_token'));

            callback(null, {success, user_id: success ? user.id : 0});
        }).catch(function (err) {
            console.log(err);
            callback(null, {success: false, user_id: 0});
        });
    },
    projectList(call, callback) {
        let offset = call.request.offset;
        if (offset < 0) {
            offset = 0;
        }
        let limit = call.request.limit;
        if (limit < 1 || limit > 20) {
            limit = 20;
        }
        
        orm.Project
            .query(function (builder) {
                builder.offset(offset).limit(limit);
            })
            .fetchAll()
            .then(function (result) {
                callback(null, {
                    projects: result.map(project => {
                        return {
                            id: project.get('id'),
                            name: project.get('name'),
                            description: project.get('description')
                        }
                    })
                });
            });
        /*
         orm.Project.fetchAll().then(function (collection) {
         let token = JSON.parse(cipher.decrypt(call.request.token));
         let success = (user.id === token.user_id) && (token.token === user.get('remember_token'));
         Models.forge()
         .query(function(qb) {
         //qb is knex query builder, use knex function here
         qb.offset(0).limit(10);
         })
         .fetchAll().then(function(result) {
         res.json(result.toJSON());
         })
         callback(null, {success, user_id: success ? user.id : 0});
         }).catch(function (err) {
         console.log(err);
         callback(null, {success: false, user_id: 0});
         });
         */
    }

};