var HTTPS = require('https');
var request = require('request');
var bot = require('./bot');

require('dotenv').config();

var botID = process.env.BOT_ID;
var pubKey = process.env.PUBLIC_KEY;
var prvKey = process.env.PRIVATE_KEY;
var bearer = process.env.BEARER_TOKEN; 
var tcgver = process.env.TCG_VERSION;

function updateToken() {
  var options, body, botreq;
  //process.env.BEARER_TOKEN = access_token
}

//get product details derived from productID's
function getDetails(productId) {
  var options, response;

  var http = require("http");
  let url = "http://api.tcgplayer.com/catalog/products/" + productId;

  var options = {
    "method": "GET",
    "url": url,
    // "hostname": "api.tcgplayer.com",
    // "path": path,
    "headers": {
      "Authorization": process.env.BEARER_TOKEN,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "cache-control": "no-cache",
      "Postman-Token": "0612dda3-572f-4af4-80b3-55d544c29400"
    }
  };
  
  return new Promise(resolve => {
    request(options, function (error, response, body) {
      if (error) {
        throw new Error(error);
      } 
      else {
        console.log("DETAILS: " + body.toString());
        resolve(body);
      }
    });
  });

  // var req = http.request(options, function (res) {
    // var chunks = [];
  
    // res.on("data", function (chunk) {
    //   chunks.push(chunk);
    // });
  
    // res.on("end", function () {
    //   var body = Buffer.concat(chunks);
    //   console.log("DETAILS: " + body.toString());
    // });
  // });
  //req.end();
}

//advanced search
function searchName(name) {
  var options, response;

  options = { 
    method: 'POST',
    url: 'http://api.tcgplayer.com/v1.17.0/catalog/categories/2/search',
    headers: 
    { 'Postman-Token': 'ab2f1322-dd36-4b9f-a7cd-b298294ad799',
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: bearer },
    body: 
    { sort: 'MinPrice DESC',
      limit: 10,
      offset: 0,
      filters: [ { name: 'ProductName', values: [ name ] } ]  },
    json: true 
  };

  return new Promise(resolve => {
    request(options, function (error, response, body) {
      if (error) {
        throw new Error(error);
      } 
      else {
        console.log(body);
        resolve(body);
      }
    });
  });

}

function getPrices(productId) {
  var options, response;

  var http = require("http");
  let url = "http://api.tcgplayer.com/v1.17.0/pricing/product/" + productId;

  var options = {
    "method": "GET",
    "url": url,
    "headers": {
      "Authorization": bearer,
      "cache-control": "no-cache",
      "Postman-Token": "8a96070b-186c-41f1-b555-084096b0aa54"
    }
  };

  return new Promise(resolve => {
    var req = request(options, function (error, response, body) {
      if (error) {
        throw new Error(error);
      } 
      else {
        console.log("PRICES: " + body.toString());
        resolve(body);
      }
    });
    //DO IN BOT.HANDLECARD
      //for each results[i].lowprice != null //response contains prices for rarities that might not exist
        //retrieve product id name + [0] image + upload and save img address
        //print name and price to 'msg'
  });
  
}


function deliverPrices(name) {
  searchName(name)
  .then(function(productID) {
    var results = JSON.parse(productID);
    console.log("DELIVERY-Id:");
    console.log(productID);
    console.log(results);
    var prices = getPrices(productID);
    console.log("DELIVERY-Prices");
    console.log(prices);
    return prices;
  }).catch(function(err) {
    console.error(err);
  });
}


exports.searchName = searchName;
exports.getDetails = getDetails;
exports.getPrices = getPrices;
exports.deliverPrices = deliverPrices;