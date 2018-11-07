var HTTPS = require('https');
var request = require('request');
var bot = require('./bot.js');

var botID = process.env.BOT_ID;
var pubKey = process.env.PUBLIC_KEY;
var prvKey = process.env.PRIVATE_KEY;
var bearer = process.env.BEARER_TOKEN;
var tcgver = process.env.TCG_VERSION;

function updateToken() {
  var options, body, botreq;
  //process.env.BEARER_TOKEN = access_token
}

function getSearchManifest() {
  var options, response;

  options = { 
    method: 'GET',
    url: 'http://api.tcgplayer.com/v1.9.0/catalog/categories/2/search/manifest',
    headers: 
    { 'Postman-Token': 'e8a67b46-ef0a-4848-851a-fffb6f696b6e',
      'cache-control': 'no-cache',
      Authorization: 'Bearer ' + bearer 
    } 
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    response = body;
    console.log(body);
  });
}

function searchName(name) {
  var options, response;

  options = { 
    method: 'POST',
    url: 'http://api.tcgplayer.com/v1.9.0/catalog/categories/2/search',
    headers: 
    { 'Postman-Token': 'ab2f1322-dd36-4b9f-a7cd-b298294ad799',
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + bearer },
    body: 
    { sort: 'MinPrice DESC',
      limit: 100,
      offset: 0,
      filters: [ { name: 'ProductName', values: [ name ] } ]  },
    json: true 
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    response = body;
    console.log(body);

    //DO IN BOT.HANDLECARD
    //for each result[i].lowprice != null
      //find product id name + [0] image + upload and save img address
      //print name and price to 'msg'
  });
}