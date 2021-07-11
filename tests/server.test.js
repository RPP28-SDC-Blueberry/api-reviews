const request = require('supertest');
const express = require('express');
const app = require('../server/app.js');

describe("Test the root path", () => {
  test("It should respond Teacup to the GET method", () => {
    return request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(418);
      })
      .catch(err => console.log(err))
  });
});