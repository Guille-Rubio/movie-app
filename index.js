require('dotenv').config();
const express = require('express');
const morgan = require('morgan')

//Web scraping
const puppeteer = require('puppeteer');

(async()=>{
  const browser = await puppeteer.launch({
    headless: false
  });
  const pase=await browser.newPage();
  await loadUrl(page, "https://www.sensacine.com/peliculas/pelicula-219262/",browser);
})();

//Web scraping

async function loadUrl(page,url,browser){
  await page.goto(url,{
      waitUntil:["load","domcontentloaded","networkidle0", "networkidle2"]
  });

  const valorEncontrado = await page.$eval(".post-message-container p", el=>el.innerHTML);
  await console.log("\nComentarios de espectadores: "+valorEncontrado+"\n");
  await browser.close();
}



const router = require('./routes/route');
const app = express();
const port = 3000;

morgan.token('host', function(req, res) {
    return req.hostname;
  });
  morgan.token('body', function (req, res) { 
    return [
        JSON.stringify(req.body)
    ] 
  })

app.set('view engine','pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(morgan(':method :host :status :param[id] - :response-time ms :body'));

morgan.token('param', function(req, res, param) {
   /*  return req.params[param];  */
});

app.use("/",router);



app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});