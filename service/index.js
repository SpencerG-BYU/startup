const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const DB = require('./database.js');

app.use(express.json());
app.use(cookieParser());

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.static('public'));

let apiRouter = express.Router();
app.use(`/api`, apiRouter);


//Registration endpoint
apiRouter.post('/auth/create', async (req, res) => {
    if (await getUser('username', req.body.username)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await createUser(req.body.username, req.body.password);
      setAuthCookie(res,user);
      res.send({ username: user.username });
    }
  });

//Login endpoint
apiRouter.put('/auth/login', async (req, res) => {
    const user = await getUser('username', req.body.username);
    if (!user) res.status(401).send({msg: 'User Does Not Exist'});
    else if (!(await bcrypt.compare(req.body.password, user.password))) res.status(401).send({ msg: 'Incorrect Username or Password' });
    else {
      setAuthCookie(res, user);
      res.send({ username: user.username });
    }
  });

//Logout endpoints
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await getUser('token', req.cookies);
    if (user) {
      clearAuthCookie(res, user);
    }
    res.send({});
  });

// Get user endpoint
apiRouter.get('/user/me', async (req, res) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
      res.send({ username: user.username });
    } else {
      res.status(401).send({ msg: 'User Does Not Exist' });
    }
  });

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await getUser('token', req.cookies['token']);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  };

  // Create a token for the user and send a cookie containing the token
function setAuthCookie(res, user) {
  user.token = uuid.v4();
  DB.updateUser(user);
  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Clear the token from the user and remove the cookie
function clearAuthCookie(res, user) {
  delete user.token;
  DB.updateUser(user);
  res.clearCookie('token');
}

apiRouter.get('/vote_total', verifyAuth, async (_req, res) => {
    const voteTotal = await DB.getVoteTotal();
    res.send(voteTotal);
  });

apiRouter.post('/votes', verifyAuth, async (req, res) => {
  const user = await getUser('token', req.cookies['token']);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  
  //Initialize user's votes if they haven't voted yet
  const userId = user.username;
  let userSubmission = await DB.getUserSubmission(userId);
  if (!userSubmission) {
    userSubmission = { userId: userId, votes: {}};
  }
  
  req.body.forEach(async vote => {
    const question = vote.question;
    const option = vote.option;
  
    //If the user has already voted on this question, decrement the previous option's vote count
    if (userSubmission.votes[question] !== undefined) {
      const previousOption = userSubmission.votes[question];
      await DB.updateVoteCount(question, previousOption, -1);
    }
  
    //Updates the user's vote for the question
    userSubmission.votes[question] = option;
  
    //Increment the vote count for the new options
    await DB.updateVoteCount(question, option, 1);
  });

  await DB.updateUserSubmission(userId, userSubmission.votes);

  res.send({});
});

async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      username: username,
      password: passwordHash,
    };
    DB.addUser(user);
    return user;
  }
  
async function getUser(field, value) {
  if (!value) return null;
  if (field == 'token') return DB.findUserByToken(value);
  return DB.findUser(value);
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});