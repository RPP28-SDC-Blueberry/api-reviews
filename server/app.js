const express = require('express');
const app = express();
const db = require('../db/postgres/db.js');

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.status(418).send('Hello, there, World on Saturday!');
});

//Redis
let client = require('redis').createClient('redis://172.31.62.219:6379');
let Redis = require('ioredis');
let redis = new Redis('redis://172.31.62.219:6379');

app.get('/products', (req, res) => {
  if (!req.query.page) {
    req.query.page = 1;
  }
  if (!req.query.count) {
    req.query.count = 5;
  }
  const productsUid = `products_page${req.query.page.toString()}_count${req.query.count.toString()}`; //productsUid is unique identifier
  //check if details are present in cache
  client.get(productsUid, (getError, getResponse)=> {
    if(getError){
      console.log('Products query could not be fetched from Redis. Error:', getError);
    }
    if(getResponse){
    //JSON objects need to be parsed after reading from redis, since it is stringified before being stored into cache

      res.status(200).json(JSON.parse(getResponse));
    }
    else{
      db.products(req.query.page, req.query.count, (dbError, dbResponse) => {
        if (dbError) {
          res.sendStatus(502);
        } else {
          res.status(200).json(dbResponse);
          //cache data received from db
          client.set(productsUid, JSON.stringify(dbResponse),(setError, setResponse)=> {
          if(setError){
            console.log('Products data not written to Redis. Error:', setError);
          }})
        }
      })
    }
  })
});

app.get('/products/:product_id', (req, res) => {

  const productUid = `product_id${req.params.product_id.toString()}`; //productUid is unique identifier
  //check if details are present in cache
  client.get(productUid, (getError, getResponse)=> {
    if(getError){
      console.log('Product query could not be fetched from Redis. Error:', getError);
    }
    if(getResponse){
    //JSON objects need to be parsed after reading from redis, since it is stringified before being stored into cache

      res.status(200).json(JSON.parse(getResponse));
    }
    else{
      db.singleProduct(req.params.product_id, (dbError, dbResponse) => {
        if (dbError) {
          res.sendStatus(502);
        } else {
          res.status(200).json(dbResponse);
          //cache data received from db
          client.set(productUid, JSON.stringify(dbResponse),(setError, setResponse)=> {
          if(setError){
            console.log('Product data not written to Redis. Error:', setError);
          }})
        }
      })
    }
  })
});

app.get('/products/:product_id/styles', (req, res) => {

  const stylesUid = `styles_product_id${req.params.product_id.toString()}`; //stylesUid is unique identifier
  //check if details are present in cache
  client.get(stylesUid, (getError, getResponse)=> {
    if(getError){
      console.log('Styles query could not be fetched from Redis. Error:', getError);
    }
    if(getResponse){
    //JSON objects need to be parsed after reading from redis, since it is stringified before being stored into cache

      res.status(200).json(JSON.parse(getResponse));
    }
    else{
      db.styles(req.params.product_id, (dbError, dbResponse) => {
        if (dbError) {
          res.sendStatus(502);
        } else {
          res.status(200).json(dbResponse);
          //cache data received from db
          client.set(stylesUid, JSON.stringify(dbResponse),(setError, setResponse)=> {
          if(setError){
            console.log('Styles data not written to Redis. Error:', setError);
          }})
        }
      })
    }
  })
});

app.get('/products/:product_id/related', (req, res) => {

  const relatedUid = `related_product_id${req.params.product_id.toString()}`; //relatedUid is unique identifier
  //check if details are present in cache
  client.get(relatedUid, (getError, getResponse)=> {
    if(getError){
      console.log('Related query could not be fetched from Redis. Error:', getError);
    }
    if(getResponse){
    //JSON objects need to be parsed after reading from redis, since it is stringified before being stored into cache

      res.status(200).json(JSON.parse(getResponse));
    }
    else{
      db.related(req.params.product_id, (dbError, dbResponse) => {
        if (dbError) {
          res.sendStatus(502);
        } else {
          res.status(200).json(dbResponse);
          //cache data received from db
          client.set(relatedUid, JSON.stringify(dbResponse),(setError, setResponse)=> {
          if(setError){
            console.log('Related data not written to Redis. Error:', setError);
          }})
        }
      })
    }
  })
});

module.exports = app;