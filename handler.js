var HTTPS = require('https');
var request = require('request');
var bot = require('./bot');

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

  var http = require("http");

  var options = {
    "method": "GET",
    "hostname": "api.tcgplayer.com",
    "path": "/catalog/products/102453",
    "headers": {
      "Authorization": "Bearer 13UCB0QBEPKwdPlMHBhqglRnpHuWHiTcX3prG2d7GIpfztC3knoGn9jQgyYtORcTudNZh8SmE9v9MNB_wL4e5b9Aciw0lg_RSOrM9PEYfHIg5MsuqUvQV1xmyeFZOPzYgTnihgLSpsaZJEh7pihVe8DJSWVVmKfS_vzLE8_e3UUQzzjEPh8I4aX6krBNzhsLSeyl05YR-ToOgufNTyVKrPduPFl9O4UNh29hQBhm9IhcakyajcbLkx96lLsNFDJcb-ZkiCnEPHdcZ4tIZPD_zxOnen-Md26fTbnmNizfORyP7-bZKPfcvXG95WgTXkVk3aHlAA",
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

  options = { 
    method: 'POST',
    url: 'http://api.tcgplayer.com/v1.9.0/catalog/categories/2/search',
    headers: 
    { 'Postman-Token': 'ab2f1322-dd36-4b9f-a7cd-b298294ad799',
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer 13UCB0QBEPKwdPlMHBhqglRnpHuWHiTcX3prG2d7GIpfztC3knoGn9jQgyYtORcTudNZh8SmE9v9MNB_wL4e5b9Aciw0lg_RSOrM9PEYfHIg5MsuqUvQV1xmyeFZOPzYgTnihgLSpsaZJEh7pihVe8DJSWVVmKfS_vzLE8_e3UUQzzjEPh8I4aX6krBNzhsLSeyl05YR-ToOgufNTyVKrPduPFl9O4UNh29hQBhm9IhcakyajcbLkx96lLsNFDJcb-ZkiCnEPHdcZ4tIZPD_zxOnen-Md26fTbnmNizfORyP7-bZKPfcvXG95WgTXkVk3aHlAA' },
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