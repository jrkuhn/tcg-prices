var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      coolRegex = /\/cool guy$/;
      cardRegex = /\/tcgprice (.*)$/;

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

function handleCard(name) {
  postMessage(name + "? \nIdk man, like, a lot I guess");
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