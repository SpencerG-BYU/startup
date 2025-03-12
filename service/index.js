const express = require('express');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

token: uuid.v4();

const users = [];
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(express.static('public'));

let apiRouter = express.Router();
app.use(`/api`, apiRouter);


//Registration endpoint
app.post('/api/auth', async (req, res) => {
    if (await getUser('username', req.body.username)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await createUser(req.body.username, req.body.password);
      setAuthCookie(res,user);
      res.send({ username: user.username });
    }
  });

//Login endpoint
app.put('/api/auth', async (req, res) => {
    const user = await getUser('username', req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      setAuthCookie(res, user);
      res.send({ username: user.username });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  });

//Logout endpoints
app.delete('/api/auth', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
      clearAuthCookie(res, user);
    }
  
    res.send({});
  });

// Get user endpoint
app.get('/api/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
      res.send({ username: user.username });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
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