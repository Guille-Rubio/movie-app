require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');

const router = require('./routes/route');
const app = express();
const port = 3000;

morgan.token('host', function (req, res) {
  return req.hostname;
});
morgan.token('body', function (req, res) {
  return [
    JSON.stringify(req.body)
  ]
})

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));
app.use(morgan(':method :host :status :param[id] - :response-time ms :body'));

morgan.token('param', function (req, res, param) {
});

app.use("/", router);



app.listen(port, () => { console.log(`Example app listening on port ${port}`) });