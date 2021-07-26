const request = require('supertest');
const express = require('express');
const app = require('../server/app.js');

var randomProductId = 1;



describe('Test the root path', () => {
  test("It should respond Teacup to the GET method", () => {
    return request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(418);
      })
      .catch(err => console.log(err))
  });
});



describe('GET /product', () => {
  test("It should respond with JSON.", () => {
    return request(app)
    .get('/users')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
        var productBody = JSON.parse(response.body);
        expect(productBody[0].id).toBeGreaterThan(0);
        expect(productBody[0]).toHaveProperty('name');
        expect(productBody[0]).toHaveProperty('slogan');
        expect(productBody[0]).toHaveProperty('description');
        expect(productBody[0]).toHaveProperty('category');
        expect(productBody[0].default_price).toBeGreaterThan(-1);
        done();
    })
    .catch(err => done(err))
  });
});

describe('GET /product', () => {
  test("It should respond with JSON, populated with appropriate keys/values.", () => {
    return request(app)
    .get('/products')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
        var productBody = JSON.parse(response.body);
        expect(productBody[0].id).toBeGreaterThan(0);
        expect(productBody[0]).toHaveProperty('name');
        expect(productBody[0]).toHaveProperty('slogan');
        expect(productBody[0]).toHaveProperty('description');
        expect(productBody[0]).toHaveProperty('category');
        expect(productBody[0].default_price).toBeGreaterThan(-1);
        done();
    })
    .catch(err => done(err))
  });
});

describe('GET random product id', () => {
  test("Random product id should be generated, greater than 0, from what is returned from /products.", () => {
    return request(app)
    .get('/products')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      var getRandomArbitrary = function (min, max) {
        return Math.random() * (max - min) + min;
      };
      var productBody = JSON.parse(response.body);
      randomProductId = productBody[getRandomArbitrary(0, productBody.length)].id;
      expect(randomProductId).toBeGreaterThan(0);
      done();
    })
    .catch(err => done(err))
  });
});

describe('GET random single product at /products/:product_id', () => {
  test("It should respond with JSON, populated with appropriate keys/values.", () => {
    return request(app)
    .get(`/products/${randomProductId.toString()}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
        var productBody = JSON.parse(response.body);
        expect(productBody[0].id).toBeGreaterThan(0);
        expect(productBody[0]).toHaveProperty('name');
        expect(productBody[0]).toHaveProperty('slogan');
        expect(productBody[0]).toHaveProperty('description');
        expect(productBody[0]).toHaveProperty('category');
        expect(productBody[0].default_price).toBeGreaterThan(-1);
        expect(productBody[0]).toHaveProperty('features');
        expect(productBody[0].features[0]).toHaveProperty('feature');
        expect(productBody[0].features[0]).toHaveProperty('value');
        done();
    })
    .catch(err => done(err))
  });
});

describe('GET styles for random single product at /products/:product_id/styles', () => {
  test("It should respond with JSON, populated with appropriate keys/values.", () => {
    return request(app)
    .get(`/products/${randomProductId.toString()}/styles`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
        var productBody = JSON.parse(response.body);
        expect(Number(productBody.product_id)).toBeGreaterThan(0);
        expect(productBody[0]).toHaveProperty('results');
        expect(productBody[0].results.style_id).toBeGreaterThan(0);
        expect(productBody[0].results).toHaveProperty('name');
        expect(Number(productBody[0].results.original_price)).toBeGreaterThan(-1);
        expect(Number(productBody[0].results.sale_price)).toBeGreaterThan(-1);
        //expect(productBody[0].default?).toBe(true) || expect(productBody[0].default?).toBe(false);
        expect(productBody[0]).toHaveProperty('photos');
        expect(productBody[0].photos).toHaveProperty('thumbnail_url');
        expect(productBody[0].photos).toHaveProperty('url');
        expect(productBody[0]).toHaveProperty('skus');
        done();
    })
    .catch(err => done(err))
  });
});

describe('GET related product array at /products/:product_id/styles', () => {
  test("It should respond with an array, populated with simple numerical values.", () => {
    return request(app)
    .get(`/products/${randomProductId.toString()}/related`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
        var productBody = JSON.parse(response.body);
        expect(productBody[0]).toBeGreaterThan(0);
        done();
    })
    .catch(err => done(err))
  });
});