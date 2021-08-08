const request = require('supertest');
const express = require('express');
const app = require('../server/app.js');

var randomProductId = 1;

jest.setTimeout(20000);

test("Root of API should respond Teacup to the GET method", () => {
  return request(app)
    .get('/')
    .then(response => {
      expect(response.statusCode).toBe(418);
    })
    .catch(err => {
      console.log(err);
      throw(err);
    });
});

test("It should respond with JSON, populated with appropriate keys/values.", () => {
  var random = Math.floor(Math.random() * 100);
  return request(app)
  .get(`/products?page=${random}`)
  .expect('Content-Type', 'application/json; charset=utf-8')
  .expect(200)
  .then(response => {
      var productBody = response.body;
      expect(Number(productBody[0].id)).toBeGreaterThan(0);
      expect(productBody[0]).toHaveProperty('name');
      expect(productBody[0]).toHaveProperty('slogan');
      expect(productBody[0]).toHaveProperty('description');
      expect(productBody[0]).toHaveProperty('category');
      expect(productBody[0].default_price[0]).toEqual('$');
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});

test("It should respond with JSON, populated with appropriate keys/values.", () => {
  var random = Math.floor(Math.random() * 1000);
  return request(app)
  .get(`/products/${random}`)
  .expect('Content-Type', 'application/json; charset=utf-8')
  .expect(200)
  .then(response => {
      var productBody = response.body;
      expect(Number(productBody.id)).toBeGreaterThan(0);
      expect(productBody).toHaveProperty('name');
      expect(productBody).toHaveProperty('slogan');
      expect(productBody).toHaveProperty('description');
      expect(productBody).toHaveProperty('category');
      expect(productBody.default_price[0]).toEqual('$');
      expect(productBody).toHaveProperty('features');
      expect(productBody.features[0]).toHaveProperty('feature');
      expect(productBody.features[0]).toHaveProperty('value');
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});

test("It should respond with JSON, populated with appropriate keys/values.", () => {
  var random = Math.floor(Math.random() * 1000);
  return request(app)
  .get(`/products/${random}/styles`)
  .expect('Content-Type', 'application/json; charset=utf-8')
  .expect(200)
  .then(response => {
      var productBody = response.body;
      expect(Number(productBody.product_id)).toBeGreaterThan(0);
      expect(productBody).toHaveProperty('results');
      expect(Number(productBody.results[0].style_id)).toBeGreaterThan(0);
      expect(productBody.results[0]).toHaveProperty('name');
      expect(productBody.results[0].original_price[0]).toEqual('$');
      expect(productBody.results[0]).toHaveProperty('sale_price');
      //expect(productBody[0].default?).toBe(true) || expect(productBody[0].default?).toBe(false);
      expect(productBody.results[0]).toHaveProperty('photos');
      expect(productBody.results[0].photos[0]).toHaveProperty('thumbnail_url');
      expect(productBody.results[0].photos[0]).toHaveProperty('url');
      expect(productBody.results[0]).toHaveProperty('skus');
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});

test("It should respond with an array, populated with simple numerical values.", () => {
  var random = Math.floor(Math.random() * 1000);
  return request(app)
  .get(`/products/${random}/related`)
  .expect('Content-Type', 'application/json; charset=utf-8')
  .expect(200)
  .then(response => {
      var productBody = response.body;
      expect(productBody[0]).toBeGreaterThan(0);
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});

test("It should respond in less than 50ms.", () => {
  var random = Math.floor(Math.random() * 1000);
  var startTime = jest.getRealSystemTime();
  return request(app)
  .get(`/products/${random}`)
  .then(response => {
    expect(response.statusCode).toBe(200);
    var endTime = jest.getRealSystemTime();
    console.log(`Individual Products API responded in ${(endTime - startTime)} milliseconds.`);
    expect((endTime - startTime)).toBeLessThan(50);
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});

test("It should respond in less than 50ms.", () => {
  var random = Math.floor(Math.random() * 1000);
  var startTime = jest.getRealSystemTime();
  return request(app)
  .get(`/products/${random}/styles`)
  .then(response => {
    expect(response.statusCode).toBe(200);
    var endTime = jest.getRealSystemTime();
    console.log(`Style API responded in ${(endTime - startTime)} milliseconds.`);
    expect((endTime - startTime)).toBeLessThan(50);
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});

test("It should respond in less than 50ms.", () => {
  var random = Math.floor(Math.random() * 100);
  var startTime = jest.getRealSystemTime();
  return request(app)
  .get(`/products?page=${random}`)
  .then(response => {
    expect(response.statusCode).toBe(200);
    var endTime = jest.getRealSystemTime();
    console.log(`Products API responded in ${(endTime - startTime)} milliseconds.`);
    expect((endTime - startTime)).toBeLessThan(50);
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});

test("It should respond in less than 50ms.", () => {
  var random = Math.floor(Math.random() * 1000);
  var startTime = jest.getRealSystemTime();
  return request(app)
  .get(`/products/${random}/related`)
  .then(response => {
    expect(response.statusCode).toBe(200);
    var endTime = jest.getRealSystemTime();
    console.log(`Related API responded in ${(endTime - startTime)} milliseconds.`);
    expect((endTime - startTime)).toBeLessThan(50);
  })
  .catch(err => {
    console.log(err);
    throw(err);
  });
});
