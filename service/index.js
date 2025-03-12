const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const users = [];
const vote_total = [{Fork:0, Spoon:0}, {Wet:0, NotWet:0}, {Soup:0, NotSoup:0}, {HeckYes:0, AbsolutelyNot:0}, {Gif:0, Jif:0}, {Pancakes:0, Waffles:0}];

app.use(express.json());
app.use(cookieParser());

const port = process.argv.length > 2 ? process.argv[2] : 3000;

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
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      setAuthCookie(res, user);
      res.send({ username: user.username });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  });

//Logout endpoints
apiRouter.delete('/auth/logout', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
      clearAuthCookie(res, user);
    }
  
    res.send({});
  });

// Get user endpoint
apiRouter.get('/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
      res.send({ username: user.username });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  });

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  };

apiRouter.post('/votes', verifyAuth, (req, res) => {
    vote_total = updateVotes(req.body);
  });

async function updateVotes(votes) {
    for (let i = 0; i < vote_total.length; i++) {
      for (const [key, value] of Object.entries(vote_total[i])) {
        vote_total[i][key] += votes[key];
      }
    }
    return vote_total;
}

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