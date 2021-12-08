// Include express router
const express = require('express');
const router = express.Router();

// Include environment variables
require('dotenv').config()

// Import firebase 
const {db} = require('../firebase.js');
const {addToken, removeToken, validateToken, extractToken} = require('../tokens.js');

router.get('/data', async(req, res) => {
    let subjects = (await db.collection('subjects').doc('01ClJ7JAUVsi9LpVuFDx').get()).data();
    res.send(subjects);
});

router.get('/generate-token', async(req, res) => {
    master_token = extractToken(req);
    if(!master_token) {
        res.status(401).send("No token provided");
        return; 
    }
    if(!(master_token == process.env.MASTER_TOKEN)) {
        res.status(401).send(`Invalid token: ${master_token}`);
        return;
    }
    let token = await addToken(db);
    res.status(200).json({token: token}).send();
});
router.get('/tokens', async(req, res) => {
    master_token = extractToken(req);
    if(!master_token) {
        res.status(401).send("No token provided");
        return;
    } 
    if(!(master_token == process.env.MASTER_TOKEN)) {
        res.status(401).send(`Invalid token: ${master_token}`);
        return;
    }
    let doc = await db.collection('tokens').doc('NApp0IvTY2JX6gUTUBMf').get();
    let list = doc.data().valid_tokens;
    res.send(list);
});

router.post('/submit', async(req, res) => {
    let token = extractToken(req);
    if(!token) {
        res.status(401).send("No token provided");
        return;
    }
    if(!await validateToken(db, token)) {
        res.status(401).send(`Invalid token: ${token}`);
        return;
    }
    //await removeToken(db, token);
    try {
        let inp = {likes: req.body.likes, dislikes: req.body.dislikes, man: req.body.man, klass: req.body.klass};
        let like = req.body.likes;
        let dislike = req.body.dislikes;
        let ref = db.collection('subjects');
        let subjects = (await ref.doc('01ClJ7JAUVsi9LpVuFDx').get()).data()["subjects"];
        console.log(subjects);
        subjects[like].push({gillar: true, man: req.body.man, klass: req.body.klass});
        subjects[dislike].push({gillar: false, man: req.body.man, klass: req.body.klass});
        await ref.doc('01ClJ7JAUVsi9LpVuFDx').set({subjects});
        res.status(200).send(subjects);
    } catch(err) {
        console.log(err);
        res.status(400).send("Bad request");
        return;
    }
});

router.delete('/clean', async(req, res) => {
    let token = extractToken(req);
    if(!token) {
        res.status(401).send("No token provided");
        return;
    }
    if(!await validateToken(db, token)) {
        res.status(401).send(`Invalid token: ${token}`);
        return;
    }
    //await removeToken(db, token);
    try {
        let ref = db.collection('subjects');
        let subjects = (await ref.doc('01ClJ7JAUVsi9LpVuFDx').get()).data()["subjects"];
        for(let key in subjects) {
            console.log(key);
            console.log(subjects[key]);
            subjects[key] = [];
        }
        await ref.doc('01ClJ7JAUVsi9LpVuFDx').set({subjects});
        res.status(200).send(subjects);
    } catch(err) {
        console.log(err);
        res.status(400).send("Bad request");
        return;
    }
});

module.exports = router;