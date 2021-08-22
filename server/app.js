const express = require('express');
const app = express();
const db = require('../db/postgres/db.js');

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.status(418).send('Hello, there, World on Thursday!');
});

//Redis
let client = require('redis').createClient(redis_url);
let Redis = require('ioredis');
let redis = new Redis('172.31.62.219:6379');

app.get('/products', (req, res) => {

  const uid = `products_page${req.query.page.toString()}_count${req.query.count.toString()}`; //uid is unique identifier
  //check if rep details are present in cache
  client.get(uid, (error, rep)=> {
    if(error){
      console.log('Query could not be fetched from Redis. Error:', error);
    }
    if(rep){
    //JSON objects need to be parsed after reading from redis, since it is stringified before being stored into cache

      res.status(200).json(JSON.parse(rep));
    }
    else{
      db.products(req.query.page, req.query.count, (error, data) => {
        if (error) {
          res.sendStatus(502);
        } else {
          res.status(200).json(data);
          //cache data received from db
          client.set(uid, JSON.stringify(response_data),(error, result)=> {
          if(error){
            console.log('Data not written to Redis. Error:', error);
          }})
        }
      })
    }
  })

});

app.get('/products/:product_id', (req, res) => {
  db.singleProduct(req.params.product_id, (error, data) => {
    if (error) {
      res.sendStatus(502);
    } else {
      res.status(200).json(data);
    }
  })
});

app.get('/products/:product_id/styles', (req, res) => {
  db.styles(req.params.product_id, (error, data) => {
    if (error) {
      res.sendStatus(502);
    } else {
      res.status(200).json(data);
    }
  })
});

app.get('/products/:product_id/related', (req, res) => {
  db.related(req.params.product_id, (error, data) => {
    if (error) {
      res.sendStatus(502);
    } else {
      res.status(200).json(data);
    }
  })
});

module.exports = app;