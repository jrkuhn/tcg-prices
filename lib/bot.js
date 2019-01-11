var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var handler = require('./handler');

require('dotenv').config();

var botID = process.env.BOT_ID;
var pubKey = process.env.PUBLIC_KEY;
var prvKey = process.env.PRIVATE_KEY;
var bearer = process.env.BEARER_TOKEN; 

var validSorts = ["ProductName ASC","MinPrice DESC","MinPrice ASC","Relevance","Sales DESC"];

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      coolRegex = /\/coolguy$/,
      cardRegex = /[./#?$]{1}[tT]cg[pP]ric[es][es]? (.*)/,
      pricesRegex = /[./#?$]{1}[pP]ric[es][es]? (.*)/,
      maxRegex = /[./#?$]{1}[mM]ax[pP]ric[es][es]? (.*)/,
      minRegex = /[./#?$]{1}[mM]in[pP]ric[es][es]? (.*)/,
      hotRegex = /[./#?$]{1}[hH]ot[pP]ric[es][es]? (.*)/,
      nmRegex = /[./#?$]{1}[Nn][Mm][pP]ric[es][es]? (.*)/,
      linkRegex = /[./#?$]{1}[lL]ink (.*)/,
      helpRegex = /[./#?$]{1}[hH]elp$/;
      
  if(request.text) {

    this.res.writeHead(200);
    switch(true) {
      case request.text.includes("== TcgPrices Help =="):
        console.log("ignoring help prompt");
        break;
      case coolRegex.test(request.text):
        coolMsg = cool();
        postMessage(coolMsg);
        break;
      case cardRegex.test(request.text): //Deprecated
        cardName = request.text.match(cardRegex);
        handleCard(cardName[1], "Relevance");
        break;
      case pricesRegex.test(request.text):
        cardName = request.text.match(pricesRegex);
        handleCard(cardName[1], "Relevance");
        break;
      case maxRegex.test(request.text):
        cardName = request.text.match(maxRegex);
        handleCard(cardName[1], "MinPrice DESC");
        break;  
      case minRegex.test(request.text):
        cardName = request.text.match(minRegex);
        handleCard(cardName[1], "MinPrice ASC");
        break;  
      case nmRegex.test(request.text):
        cardName = request.text.match(hotRegex);
        handleNm(cardName[1], "Relevance");
        break;
      case hotRegex.test(request.text):
        cardName = request.text.match(hotRegex);
        handleCard(cardName[1], "Sales DESC");
        break;
      case linkRegex.test(request.text):
        cardName = request.text.match(linkRegex);
        handleLink(cardName[1]);
        break;
      case helpRegex.test(request.text):
        var helpMessage = "== TcgPrices Help =="
        +"\n/price <card>  -  sort Relevence"
        +"\n/maxprice <card>  -  sort $High"
        +"\n/minprice <card>  -  sort $Low"
        +"\n/hotprice <card>  -  sort Popular"
        +"\n/link <card>  -  link to TCGplayer";
        postMessage(helpMessage);
        break;
      default:
        console.log("no matching command");
        break;
    }
    this.res.end();
    
  } else {
    console.log("no command");
    this.res.writeHead(200);
    this.res.end();
  }
}

async function handleCard(name, sort) {
  if(name == null || !validSorts.includes(sort)) { console.error("Invalid Name/Sort"); return; }

  var results = await handler.deliverPrices(name, sort);
  console.log(results);

  

  var message = formatMsg(results);

  postMessage(message);
  //postMessage(">" + name + "? \nIdk man, like, a lot I guess");
}

function handleNm(name, sort) {
  var results = await handler.deliverPricesNm(name, sort);
  console.log(results);

  if(results.success && results.success == 'false') {
    postMessage("no, i borken");
    return;
  }

}

function formatMsg(results) {
  var message = "", currName = "", currSeries = "";
  results.prices.forEach(function(card, i) {
      //build card description
      if(card.name && card.name != currName) {
        if(i == 0) { message += card.name; } //first line
        else { message += "\n" + card.name };

        if(card.rarity) { message += " ("+card.rarity+")"; }
        if(card.series) { message += " ["+card.series+"]"; }
        
        currName = card.name; //update name 
        currSeries = card.series; //update series
      }
      //consecutively same name, different series
      else if(card.series && card.series != currSeries) { 
        message += "\n" + card.name;
        if(card.rarity) { message += " ("+card.rarity+")"; }
        message += " ["+card.series+"]";

        currSeries = card.series; //update series
      }

      //build pricing description
      if(card.subTypeName) { 

        //skip over Unm if 1st exists
        if(card.subTypeName == "Unm") {
          //ahead
          if(i < results.prices.length-1 && results.prices[i+1].series == currSeries) {
            if(results.prices[i+1].subTypeName == "1st") { return; }
          } //behind
          if(i > 0 && i < results.prices.length && results.prices[i-1].series == currSeries) {
            if(results.prices[i-1].subTypeName == "1st") { return; }
          }
        }
        message += "\n  ["+card.subTypeName+"]";

        if(card.lowPrice) { message += " low:$" + card.lowPrice.toFixed(2); }
        if(card.marketPrice) { message += "  market:$" + card.marketPrice.toFixed(2); }
      }
  });

  return message;
}

function handleLink(name) {
  name = name.replace(/\s/g , "+");
  postMessage(">.https://shop.tcgplayer.com/yugioh/product/show?ProductName="+name+"&Price_Condition=Less+Than");
}


function postMessage(msg) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : msg
  };

  console.log('sending ' + msg + ' to ' + botID);

  //POST to groupme
  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;