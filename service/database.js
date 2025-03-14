const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

//Connect to database cluster
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('users');

(async function testConnection() { 
    try {
        await db.command({ping:1});
        console.log('DB connected to ${config.hostname}');
    } catch(ex) {
        console.log('Connection failed to ${url} because ${ex.message}');
        process.exit(1);
    } 
})();

async function addUser(user) {
    await userCollection.insertOne(user);
}

function findUser(username) {
    return userCollection.findOne({username : username});
}

function findUserByToken(token) {
    return userCollection.findOne({token : token});
}

