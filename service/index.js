const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const users = [];
const vote_total = [{"Fork":0, "Spoon":0}, {"Wet":0, "Not Wet":0}, {"Soup":0, "Not Soup":0}, {"Heck Yes":0, "Absolutely Not":0}, {"Gif":0, "Jif":0}, {"Pancakes":0, "Waffles":0}];
const userVotes = {};

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

apiRouter.get('/vote_total', verifyAuth, (_req, res) => {
    res.send(vote_total);
  });

apiRouter.post('/votes', verifyAuth, (req, res) => {
  const user = getUser('token', req.cookies['token']);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  
  //Initialize user's votes if they haven't voted yet
  const userId = user.username;
  if (!userVotes[userId]) {
    userVotes[userId] = [];
  }
  
  req.body.forEach(vote => {
  const question = vote.question;
  const option = vote.option;
  
    //If the user has already voted on this question, decrement the previous option's vote count
    if (userVotes[userId][question] !== undefined) {
      const previousOption = userVotes[userId][question];
      vote_total.forEach(voteItem => {
        if (voteItem[previousOption] !== undefined) {
          voteItem[previousOption] -= 1;
        }
      });
    }
  
    //Updates the user's vote for the question
    userVotes[userId][question] = option;
  
    //Increment the vote count for the new options
    vote_total.forEach(voteItem => {
      if (voteItem[option] !== undefined) {
        voteItem[option] += 1;
      }
    });
  });
  
  res.send(vote_total);
});

async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      username: username,
      password: passwordHash,
    };
    users.push(user);
    return user;
  }
  
function getUser(field, value) {
    if (value) {
      return users.find((user) => user[field] === value);
    }
    return null;
}

// Create a token for the user and send a cookie containing the token
function setAuthCookie(res, user) {
    user.token = uuid.v4();

    res.cookie('token', user.token, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

// Clear the token from the user and remove the cookie
function clearAuthCookie(res, user) {
    delete user.token;
    res.clearCookie('token');
  }

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});