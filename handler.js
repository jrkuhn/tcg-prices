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

function getDetails(productId) {
  var options, response;
  console.log('DETAIL: ' + bearer);

  var http = require("http");

  var options = {
    "method": "GET",
    "hostname": "api.tcgplayer.com",
    "path": "/catalog/products/102453",
    "headers": {
      "Authorization": process.env.BEARER_TOKEN,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "cache-control": "no-cache",
      "Postman-Token": "0612dda3-572f-4af4-80b3-55d544c29400"
    }
  };
  
  var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  
  req.end();
}

function searchName(name) {
  var options, response;
  console.log('SEARCH: ' + bearer);

  options = { 
    method: 'POST',
    url: 'http://api.tcgplayer.com/v1.9.0/catalog/categories/2/search',
    headers: 
    { 'Postman-Token': 'ab2f1322-dd36-4b9f-a7cd-b298294ad799',
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: bearer },
    body: 
    { sort: 'MinPrice DESC',
      limit: 100,
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
        resolve(JSON.parse(body));
      }
      

      //DO IN BOT.HANDLECARD
      //for each result[i].lowprice != null
        //find product id name + [0] image + upload and save img address
        //print name and price to 'msg'
    });
  });
}

exports.searchName = searchName;
exports.getDetails = getDetails;