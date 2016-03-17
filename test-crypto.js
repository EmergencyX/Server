'use strict';
require('dotenv').config();
const crypto = require('crypto');

const _crypto = require('./lib/crypto');
const test = crypto.randomBytes(512).toString('utf8');
let a = _crypto.encrypt(test);
let b = _crypto.decrypt(a);
console.log(test);
console.log(b);
console.log(a);

console.log(test===b);