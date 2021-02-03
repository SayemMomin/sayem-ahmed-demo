const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const objectid = require('mongodb').ObjectId;
const cors = require('cors')
const fs = require('fs-extra')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8hyt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload());
const port = 9000

app.get('/', (req, res) => {
  res.send('Hello Demo!')
})

client.connect(err => {
    const imageCollection = client.db(`${process.env.DB_NAME}`).collection("images");

app.post('/addimages', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    console.log(email, 'email2');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
    
        imageCollection.insertOne({name, email, image})
    .then(result => {
        //console.log(result.email, 'send email');
      res.send(result.insertedCount > 0)
    })
})

app.get('/myImages', (req, res) => {
    console.log(req.query.email, 'email')
    imageCollection.find({email: req.query.email})
    //imageCollection.find({})
    .toArray((err, documents) => {
        res.send(documents)
    })
  })
});

  app.listen(process.env.PORT || port)