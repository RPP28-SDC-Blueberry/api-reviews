const express = require('express');
const app = express();
const db = require('../db/postgres/db.js');

app.get('/', (req, res) => {
  res.status(418).send('Hello World!');
});

app.get('/products', (req, res) => {
  if (req.query.page === undefined) {
    var page = 1;
  } else {
    var page = Number(req.query.page);
  }
  if (req.query.count === undefined) {
    var count = 5;
  } else {
    var count = Number(req.query.count);
  }
  db.products((error, data) => {
    if (error) {
      res.sendStatus(502);
    } else {
      res.status(200).json(data);
    }
  }, page, count)
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