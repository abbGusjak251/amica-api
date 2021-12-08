const admin = require('firebase-admin');
const serviceAccount = require('./keys/favokurs-firebase-adminsdk-90rmw-11a8aff53c.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://favokurs-default-rtdb.europe-west1.firebasedatabase.app/"
});

const db = admin.firestore();

async function getSubjects(db) {
    let doc = await db.collection('tokens').doc('NApp0IvTY2JX6gUTUBMf').get();
    return doc.data();
}

module.exports = {db};