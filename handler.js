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
function getDetails(productIds) {
  var options, response;

  var http = require("http");
  let url = "http://api.tcgplayer.com/catalog/products/" + productIds + "?getExtendedFields=true";

  var options = {
    "method": "GET",
    "url": url,
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
        //console.log("DETAILS: " + body.toString());
        resolve(body);
      }
    });
  });
}

//advanced search
function searchName(name, sort) {
  var options, response;
  var srchUrl = "http://api.tcgplayer.com/"+tcgver+"/catalog/categories/2/search";
  options = { 
    method: 'POST',
    url: srchUrl,
    headers: 
    { 'Postman-Token': 'ab2f1322-dd36-4b9f-a7cd-b298294ad799',
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: bearer },
    body: //'MinPrice DESC'
    { sort: sort,
      limit: 5,
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
        //console.log(body);
        resolve(body);
      }
    });
  });

}

function getPrices(productIds) {
  var options, response;

  var http = require("http");
  let url = "http://api.tcgplayer.com/"+tcgver+"/pricing/product/"+productIds;

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
        //console.log("PRICES: " + body.toString());
        resolve(body);
      }
    });
    //DO IN BOT.HANDLECARD
      //for each results[i].lowprice != null //response contains prices for rarities that might not exist
        //retrieve product id name + [0] image + upload and save img address
        //print name and price to 'msg'
  });
  
}

//returns JSON of all valid prices for the name search
function deliverPrices(name, sort) {
  
  return new Promise(resolve => {
    var results = {};
    var prodIds = {};
    var numPrices = 0;

    searchName(name, sort)
    .then(function(productIds) {
      //console.log("DELIVERY-Id:");
      //console.log(productIds.results);
      prodIds = productIds.results;
      return getPrices(productIds.results);
    })
    .then(function(resp) {
      var validPrices = {};
      validPrices["results"] = [];
      var prices = JSON.parse(resp);

      //filter nulls
      numPrices = prices.results.length;
      if(numPrices > 0) {
        for(i = 0; i < numPrices; i++) {
          if(prices.results[i].lowPrice != null){
            validPrices["results"].push(prices.results[i]);
          }
        }
      }
      results.prices = validPrices.results;
      //console.log(validPrices);

      return getDetails(prodIds);
    })
    .then(function(resp) { //combined pricing results and product details results
      //console.log(resp);
      var cardIndex = {};
      var cardDetails = JSON.parse(resp);
      
      //index card details them first, each productID being the key
      cardDetails.results.forEach(function(card) {
        cardIndex[card.productId] = card;
      });
      //console.log(cardIndex);

      results.prices.forEach(function(price, i) {
        var id = results.prices[i].productId;
        results.prices[i].name = cardIndex[id].name;
        results.prices[i].subTypeName = abbrvEd(price.subTypeName);
        //extended values
        cardIndex[id].extendedData.forEach(function(eData, j) {
          console.log(eData);
          if(eData.name == "Number") { results.prices[i].series = eData.value; }
          if(eData.name == "Rarity") { results.prices[i].rarity = abbrvRarity(eData.value); }
        })
        // results.prices[j].series = cardIndex[id].extendedData[0].value;
        // results.prices[j].rarity = cardIndex[id].extendedData[1].value;
      });

      resolve(results);
    }).catch(function(err) {
      console.log("Justin needs to fix me");
      console.error(err);
    });
  });
}

function abbrvRarity(rarity) {
  if(rarity == null) {
    return;
  }
  switch(rarity) {
    case "Common":
      return "CM";
      break;
    case "Rare":
      return "R";
      break;
    case "Super Rare": 
      return "SR";
      break;
    case "Ultra Rare":
      return "UR";
      break;
    case "Secret Rare":
      return "SCR";
      break;
    case "Ultimate Rare":
      return "ULT";
      break;
    case "Ghost Rare":
      return "GR";
      break;
    default:
      return;
      break;
  }
}

function abbrvEd(edition) {
  if(edition == null) {
    return;
  }
  switch(edition) {
    case "Unlimited":
      return "Unm";
      break;
    case "1st Edition":
      return "1st";
      break;
    case "Limited":
      return "Ltd";
      break;
    case "Promo":
      return "Promo";
      break;
    case "1st Edition - Ultimate":
      return "1st";
      break;
    case "Unlimited - Ultimate":
      return "Unm";
      break;
    default:
      return edition;
      break;
  }
}


exports.searchName = searchName;
exports.getDetails = getDetails;
exports.getPrices = getPrices;
exports.deliverPrices = deliverPrices;