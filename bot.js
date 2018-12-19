import HTTPS from 'https';
import cool from 'cool-ascii-faces';
import handler from './handler';

require('dotenv').config();

var botID = process.env.BOT_ID;
var pubKey = process.env.PUBLIC_KEY;
var prvKey = process.env.PRIVATE_KEY;
var bearer = process.env.BEARER_TOKEN; 

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      coolRegex = /\/cool guy$/;
      cardRegex = /[./#?$]{1}[tT]cgpric[es][es]? (.*)/;
      linkRegex = /[./#?$]{1}[tT]cglink (.*)/;
      
  if(request.text) {
    switch(true) {
      case coolRegex.test(request.text):
        this.res.writeHead(200);
        coolMsg = cool();
        postMessage(coolMsg);
        this.res.end();
        break;
      case cardRegex.test(request.text):
        this.res.writeHead(200);
        cardName = request.text.match(cardRegex);
        handleCard(cardName[1]);
        this.res.end();
        break;
      case linkRegex.test(request.text):
        this.res.writeHead(200);
        cardName = request.text.match(linkRegex);
        handleLink(cardName[1]);
        this.res.end();
      default:
        console.log("no matching command");
        this.res.writeHead(200);
        this.res.end();
        break;
    }
    
  } else {
    console.log("no command");
    this.res.writeHead(200);
    this.res.end();
  }
}

async function handleCard(name) {
  const detailsProm = handler.getDetails(102453);
  const searchProm = await handler.searchName(name);
  const priceProm = await handler.getPrices(102453);
  //console.log(searchProm);
  postMessage(">" + name + "? \nIdk man, like, a lot I guess");
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