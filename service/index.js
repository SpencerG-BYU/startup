const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(express.static('public'));

let apiRouter = express.Router();
app.use(`/api`, apiRouter);


app.get('*', (_req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});