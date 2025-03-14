const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('users');
const submissionCollection = db.collection('votes');

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

function updateUser(user) {
    return userCollection.updateOne({username : user.username}, {$set : user});
}

function getUserSubmission(userID) {
    return submissionCollection.findOne({userID : userID});
}

function updateUserSubmission(userId, votes) {
    return submissionCollection.updateOne(
        {userId : userId},
        {$set : {votes: votes}},
        {upsert : true}
    );
}
async function getVoteTotal() {
    const submissions = await submissionCollection.find({}).toArray();
    const voteTotal = {};

    submissions.forEach(submission => {
        const votes = submission.votes || {};
        Object.keys(votes).forEach(question => {
            const option = votes[question];
            if (!voteTotal[question]) {
                voteTotal[question] = {};
            }
            if (!voteTotal[question][option]) {
                voteTotal[question][option] = 0;
            }
            voteTotal[question][option] += 1;
        });
    });
    return voteTotal;
}

module.exports = {
    findUser,
    findUserByToken,
    addUser,
    updateUser,
    getUserSubmission,
    updateUserSubmission,
    getVoteTotal
  };

