var pgp = require('pg-promise')(/* options */);
var db = pgp('postgres://postgres:password@ec2-107-20-117-139.compute-1.amazonaws.com:5432/blueberry-product');

var queryProducts = (page = 1, count = 5, callback) => {
  var range = [((page * count) - count + 1), (page * count)];
  db.map('SELECT product_id, name, slogan, description, category, default_price FROM product WHERE product_id BETWEEN $1 AND $2', range, (row, index, data) => {
    return {
      id: row.product_id,
      name: row.name,
      slogan: row.slogan,
      description: row.description,
      category: row.category,
      default_price: row.default_price
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

var querySingleProduct = (id, callback) => {

  return Promise.all([
    db.one('SELECT * FROM product WHERE product_id = $1', [id]),
    db.map('SELECT * FROM features WHERE product_id = $1', [id], (row, index, data) => {
      return {feature: row.feature, value: row.value};
    })
  ])

  .then(function (data) {
    return {
      id: data[0].product_id,
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
    styleNumbers.push(row.style_id);
    return {
      style_id: row.style_id,
      name: row.name,
      original_price: row.original_price,
      sale_price: row.sale_price,
      'default?': row.default_style,
      skus: {},
      photos: []
    };
  })
  .then(function (data) {
    if (data.length === 0) {
      return [[], [], []];
    }
    return Promise.all([
      new Promise((resolve, reject) => {
        resolve(data);
      }),
      db.manyOrNone('SELECT * FROM photos WHERE style_id IN ($1:list)', [styleNumbers]),
      db.manyOrNone('SELECT * FROM skus WHERE style_id IN ($1:list)', [styleNumbers])
    ]);
  })
  .then (function (data) {
    var photos = data[1];
    var skus = data[2];
    var output = {
      product_id: id,
      results: data[0]
    };
    var skuIndex = 0;
    for (var i = 0; i < skus.length; i++) {
      if(skus[i].style_id === output.results[skuIndex].style_id) {
        output.results[skuIndex].skus[skus[i].sku_id] = {quantity: skus[i].quantity, size: skus[i].size};
      } else {
        while (skus[i].style_id !== output.results[skuIndex].style_id) {
          skuIndex++;
        }
        output.results[skuIndex].skus[skus[i].sku_id] = {quantity: skus[i].quantity, size: skus[i].size};
      }
    }
    var photoIndex = 0;
    for (var i = 0; i < photos.length; i++) {
      if(photos[i].style_id === output.results[photoIndex].style_id) {
        output.results[photoIndex].photos.push({thumbnail_url: photos[i].thumbnail_url, url: photos[i].url});
      } else {
        while (photos[i].style_id !== output.results[photoIndex].style_id) {
          photoIndex++;
        }
        output.results[photoIndex].photos.push({thumbnail_url: photos[i].thumbnail_url, url: photos[i].url});
      }
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