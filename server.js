//saaff url short

const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const update = require('./models/shortUrl')

const app = express()
app.use(express.json()); // reconoce json

//conecion con db
//const url = 'FRONT_END_URL/qr/shortURL';
mongoose.connect('mongodb://localhost/UrlShort', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs') //designa el ejs para el de params
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

//endpoint
//peticion post de shot url para leer en index fullurl
app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

//peticion get de shot url para mostrarse en index para shorturl
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})


//peticion post actualiza newUrlFull
app.post('/update', async (req, res) => {

const idMod = req.body.idchange;
const newUrl = req.body.newUrlFull;

console.log('data contiene 1:', idMod);
console.log('data contiene 2:', newUrl);

await ShortUrl.findOneAndUpdate({
  _id : idMod
},{
  full: newUrl
})

 res.redirect('/')
})




app.listen(process.env.PORT || 5000);

