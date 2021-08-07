var pgp = require('pg-promise')(/* options */);
var db = pgp('postgres://postgres:password@localhost:5432/blueberry-product');

var queryProducts = (callback, page = 1, count = 5) => {
  var range = [((page * count) - count + 1), (page * count)];
  db.many('SELECT product_id AS id, name, slogan, description, category, default_price FROM product WHERE product_id BETWEEN $1 AND $2', range)
  .then (function (data) {
    callback(null, data);
  })
  .catch(function (error) {
    callback(error, null);
    console.log(error);
  });
};

var querySingleProduct = (id, callback) => {

  return Promise.all([
    db.one('SELECT * FROM product WHERE product_id = $1', [id]),
    db.map('SELECT * FROM features WHERE product_id = $1', [id], (row, index, data) => {
      return {feature: row.feature, value: row.value};
    })
  ])

  .then(function (data) {
    return {
      id: Number(data[0].product_id),
      name: data[0].name,
      slogan: data[0].slogan,
      description: data[0].description,
      category: data[0].category,
      default_price: data[0].default_price,
      features: data[1]
    };
  })
  .then (function (data) {
    callback(null, data);
  })
  .catch(function (error) {
    callback(error, null);
    console.log(error);
  });
};

var queryStyles = (id, callback) => {
  var styleNumbers = [];
  db.map('SELECT * FROM styles WHERE product_id = $1', [id], (row, index, data) => {
    styleNumbers.push(Number(row.style_id));
    return {
      style_id: Number(row.style_id),
      name: row.name,
      original_price: row.original_price,
      sale_price: row.sale_price,
      'default?': row.default_style,
      skus: {},
      photos: []
    };
  })
  .then(function (data) {

    return Promise.all([new Promise((resolve, reject) => {
      resolve(data);
    }), db.map('SELECT * FROM photos WHERE style_id IN ($1:list)', [styleNumbers], (row, index, data) => {
      return row;
    }), db.map('SELECT * FROM skus WHERE style_id IN ($1:list)', [styleNumbers], (row, index, data) => {
      row.product_id = id.toString();
      return row;
    })]);
  })
  .then (function (data) {
    var photos = data[1];
    var skus = data[2];
    var output = {
      product_id: skus[0].product_id,
      results: data[0]
    };
    for (var i = 0; i < skus.length; i++) {
      output.results[styleNumbers.indexOf(Number(skus[i].style_id))].skus[skus[i].sku_id] = {quantity: skus[i].quantity, size: skus[i].size};
    }
    for (var i = 0; i < photos.length; i++) {
      output.results[styleNumbers.indexOf(Number(photos[i].style_id))].photos.push({thumbnail_url: photos[i].thumbnail_url, url: photos[i].url});
    }
    callback(null, output);
  })
  .catch(function (error) {
    callback(error, null);
  });
};

var queryRelated = (id, callback) => {
  db.map('SELECT related_product_id FROM related WHERE product_id = $1', [id], (row, index, data) => {
    return Number(row.related_product_id);
  })
  .then(function (data) {
    callback(null, data);
  })
  .catch(function (error) {
    console.log('ERROR:', error);
    callback(error, null);
  });
};

  module.exports = {
    products: queryProducts,
    singleProduct: querySingleProduct,
    styles: queryStyles,
    related: queryRelated
  };