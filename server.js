//saaff url short

const express = require('express');
const { Date } = require('mongoose');
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')


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
  await ShortUrl.create({ UrlDestination: req.body.fullUrl })

  res.redirect('/')
})


//peticion get de shot url para mostrarse en index para shorturl
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.UrlDestination)
})


//peticion post actualiza newUrlFull
app.post('/update', async (req, res) => {

  const idMod = req.body.idchange;
  const newUrl = req.body.newUrlFull;

  console.log('data contiene 1:', idMod);
  console.log('data contiene 2:', newUrl);

  await ShortUrl.findOneAndUpdate({
    _id: idMod
  }, {
    UrlDestination: newUrl
  })

  res.redirect('/')
})


//----- Modificaciones de Relacion con historic -----//


//peticion post para crear un short y un nuevo historico y base de historic sin modificar en bruto
app.post('/shortUrlsXXX', async (req, res) => {
  await ShortUrl.create({
    UrlDestination: req.body.fullUrl,
    BeforeUrl: req.body.fullUrl,
    dateChange: new Date()
  })

  res.redirect('/')
})

//peticion post actualiza newUrlFull
app.post('/updatexxx', async (req, res) => {

  const idMod = req.body.idchange;
  const newUrl = req.body.newUrlFull;
  //const oldUrl = await ShortUrl.find({ "full": { _id: idMod } })
  const oldUrl = await ShortUrl.find( { _id: idMod }, {UrlDestination:1, _id:0} );
  const clickFull = await ShortUrl.find( { _id: idMod }, {clicks:1, _id:0} );
  const updateDate = new Date();
  const regiterHistoric = `urlBefore: ${oldUrl}, UrlDestination: ${newUrl}, dateUpdate:${updateDate}, UrlDestinationClicks: ${clickFull}`; //concatena informacion historic


  //$addToSet - agrega nuevos valores, cambiando Url larga
  await ShortUrl.findOneAndUpdate({ _id: idMod },

    {
      UrlDestination: newUrl,
      BeforeUrl: oldUrl,
      dateChange: updateDate
    })

    //agrega historico en bruto 
  await ShortUrl.findOne({ _id: idMod },

    {
      $push:
      {
        dateChange: regiterHistoric
      }
    }

  )

  res.redirect('/')

})

//peticion que asigna shortUrl a Asset, se debe direccionar enpoint a asset
app.put('/:idasset/:shortUrl'), async (req, res) => {

  const { idasset } = req.param;
  const { shortUrl } = req.param;

  await Asset.findOneAndUpdate(idasset, { $push: { url: shortUrl } });

  /*
  
  db.asset.aggregate([
  {$lookup:
  
  {
    from:'ShortUrl',
    localFiels:'short', //crear
    foreignField:'idShort',
    as:'shortAsingId'
  
    }
  
  }
    ]);
  
  */

  res.redirect('/')

}



app.listen(process.env.PORT || 5000);







