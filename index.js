require('dotenv').config();
//require('./config/keys');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');

const morgan = require('./config/morganConfig');
const cors = require('cors');


const helmet = require('helmet');
const router = require('./routes/route');
const app = express();

const port = process.env.PORT || keys.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');
app.use(compression())
app.use(
    helmet.contentSecurityPolicy({
      directives: {
          "img-src":["'Self'", "https://m.media-amazon.com"]
      },
    }),
    
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

//app.use(morgan(':method :host :status :param[id] - :response-time ms :body'));


app.use("/", router);



app.listen(port, () => { console.log(`Example app listening on port ${port}`) });