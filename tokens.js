// Import firebase 
const {db} = require('./firebase.js');

const crypto = require('crypto');

function generateToken(list) {
    let token;
    do {
        token = crypto.randomBytes(16).toString('hex');
    } while(list.includes(token));
    return token;
}

async function addToken(db) {
    let doc = await db.collection('tokens').doc('NApp0IvTY2JX6gUTUBMf').get();
    let list = doc.data().valid_tokens;
    console.log(list);
    let token = generateToken(list);
    list.push(token);
    await db.collection('tokens').doc('NApp0IvTY2JX6gUTUBMf').set({
        valid_tokens: list
    });
    return token;
}
async function validateToken(db, token) {
    let doc = await db.collection('tokens').doc('NApp0IvTY2JX6gUTUBMf').get();
    let list = doc.data().valid_tokens;
    if(list.includes(token)) {
        return true;
    }
    return false;
}
async function removeToken(db, token) {
    let doc = await db.collection('tokens').doc('NApp0IvTY2JX6gUTUBMf').get();
    let list = doc.data().valid_tokens;
    try {
        list.pop(list.indexOf(token));
        await db.collection('tokens').doc('NApp0IvTY2JX6gUTUBMf').set({
            valid_tokens: list
        });
    } catch(err) {
        console.log(err);
    }
    return list;
}

function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

module.exports = {addToken, removeToken, validateToken, extractToken};