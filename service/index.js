const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const DB = require('./database.js');
const { leaderSocket, broadcast } = require('./leaderSocket.js');

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
    
    // Initialize user's votes if they haven't voted yet
    const userId = user.username;
    let userSubmission = await DB.getUserSubmission(userId);
    if (!userSubmission) {
      userSubmission = { userId: userId, votes: {} };
    }
  
    for (const vote of req.body) {
      const question = vote.question;
      const option = vote.option;
      userSubmission.votes[question] = option;
    };

    await DB.updateUserSubmission(userId, userSubmission.votes);

    //Broadcast updated vote totals
    const message = '${userId} has voted!';
    broadcast(JSON.stringify( { type: 'userVote', message}));

    res.send({});
  }
);

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public'});
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

const httpService = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

leaderSocket(httpService);