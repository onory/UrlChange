const mongodb = require('mongodb');
const { ObjectId } = require('mongoose');
const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({

  UrlDestination: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },

  BeforeUrl: {
      type: String,
      required: true
  },

  dateChange: {
      type: Date,
      required: true,
  },
  historic: {
  type: Array,
  required: true,
  }
  
});

//id
//destino - UrlDestination
//acortado - short
//contadorClicks - clicks
//historico [ {destino:, anterio:,fecha:,clicks}] -historic

//mind map



module.exports = mongoose.model('ShortUrl', shortUrlSchema);
