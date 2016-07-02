'use strict';
const crypto = require('crypto');
const encoding = 'base64';
const cipherAlgorithm = 'aes-256-cbc';
const hmacAlgorithm = 'sha256';

const cipherKey = new Buffer(process.env.APP_KEY, encoding);

function encrypt(data) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(cipherAlgorithm, cipherKey, iv);
    let value = cipher.update(data, 'utf8', encoding) + cipher.final(encoding);
    let mac = hmac(value, iv = iv.toString(encoding));

    return new Buffer(JSON.stringify({value, iv, mac})).toString(encoding);
}

function decrypt(data) {
    data = JSON.parse(new Buffer(data, encoding).toString());
    if (!data.payload || !data.iv || !data.mac) {
        new Error('Invalid decryption attempt');
    }
    if (!verifyPayload(data.value, data.iv, data.mac)) {
        new Error('Invalid hmac attempt');
    }

    let iv = new Buffer(data.iv, encoding);
    let cipher = crypto.createDecipheriv(cipherAlgorithm, cipherKey, iv);
    return cipher.update(data.value, encoding, 'utf8') + cipher.final('utf8');
}

function verifyPayload(data, iv, mac) {
    const key = crypto.randomBytes(32);
    let recalculatedHash = hmac(data, iv);
    let firstDoubleHash = crypto.createHmac(hmacAlgorithm, key).update(recalculatedHash).digest();
    let secondDoubleHash = crypto.createHmac(hmacAlgorithm, key).update(mac).digest();

    return firstDoubleHash.equals(secondDoubleHash);
}

function hmac(data, iv) {
    return crypto.createHmac(hmacAlgorithm, cipherKey).update(iv + data).digest(encoding);
}

module.exports = {
    encrypt, decrypt
};