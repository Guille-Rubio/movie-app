require('dotenv').config();
const express = require('express');

const router = require('./routes/route');
const app = express();
const port = 3000;


app.set('view engine','pug');
app.set('views', './views')

app.use(express.json());
app.use(express.static('public'));

app.use("/",router);



app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});