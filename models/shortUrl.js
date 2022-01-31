const mongodb = require('mongodb')
const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({

  full: {
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
  }
});

//CRUD

const update = async (id, full) => {
  const urls = await ShortUrl.updateOne({ id: id },

      {

          $set: {
              full: full
          }

      })
};


/*
const create = async (id, full, short, clicks) => {
    const urls = await ShortUrl({
        id: id,
        full: full,
        short: short,
        click: clicks
    })
    const save = await urls.save()
    console.log(save)
}

const red = async () => {
  const urls = await ShortUrl.find()
  console.log(urls)

}

const deleted = async(id)=>{
  const urls = await ShortUrl.deleteOne({ id: id })
   console.log(urls)
}

*/




module.exports = mongoose.model('ShortUrl', shortUrlSchema),update;
