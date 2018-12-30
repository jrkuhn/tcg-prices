# TCGprices

## Introduction

TCGprices is a chatbot for use in GroupMe chatrooms. The bot which is created in Node.js and hosted in Heroku is able to respond to pricing requests from GroupMe chatroom messages for any tcg product listed on the popular hobby retailer TCGplayer by utilizing their TCGAPI Endpoints. It can respond with live pricing data in various ways or link directly to TcgPlayer's search page for the desired product.

## Commands

| Command | Description |
| --- | --- |
| /price <name> | bot sends pricing data of the search results for <name> sorted by Relevance |
| /maxprice <name> | bot sends pricing data sorted by Highest Price first |
| /minprice <name> | bot sends price results sorted by Lowest Price first |
| /hotprice <name> | bot sends price results sorted by Best Selling first |
| /link <name> | bot sends a link to the TCGplayer.com search results page for <name> |
| /help | bot sends a list of shortened descriptions for all commands |

# Adding the bot to your chat<a name="deploy"></a>

## Requirements:

  * GroupMe account
  * Heroku account
  * [Heroku Toolbelt](https://toolbelt.heroku.com/)


## Deploy to Heroku:

Be sure to log into heroku, using your heroku credentials, then click the link below.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Here you can configure the your new bot's basic information and add it to your heroku account.


## Creating the GroupMe Bot:

Go to:
https://dev.groupme.com/session/new

Use your GroupMe credentials to log into the developer site.

Once you have successfully logged in, go to https://dev.groupme.com/bots/new

Fill out the form to create your new bot:

  * Select the group chat for the bot to reside
  * Give your bot a name
  * Paste in the url to your newly deployed heroku app
    * `http://your-app-name-here.herokuapp.com/`
  * (Optional) Give your bot an avatar by providing an Avatar URL to an image
  * Click submit

## Find your Bot ID:<a name="get-bot-id"></a>

Go here to view all of your bots:
https://dev.groupme.com/bots

Click on the Bot Name or Bot ID of the one you just created.
Your bot's Details page should open.
Here you can copy the Bot ID for the next configuration steps.

## Add your Bot ID to the Heroku app:

Go here to see all of your Heroku apps and select the one you just created before:
https://dashboard-next.heroku.com/apps

On your app page:
  * Click *Settings* in the top navigation bar:
  * Find the Config Vars section and click the *Reveal Config Vars* button:
  * Find the edit button (pencil icon) and click it
  * Fill out the form to add an environment variable to your app:
     ** In the "key" field type: BOT_ID
     ** In the "value" field paste your Bot ID that you copied in the previous steps
     ** Click the save button

![Add the Bot ID environment variable](http://i.groupme.com/784x148.png.5790498a7acd46b289aca2be43e9c84e)

# Configuring your Bot<a name="custom"></a>

## Pull the code to your local machine

Within terminal, change directory to the location where you would like the files to live, then run this command:

    $ heroku git:clone -a YOUR_APP_NAME_HERE

And then change directory into the new folder

    $ cd YOUR_APP_NAME_HERE

## Configure your local BOT_ID environment variable

Open the file `.env` from your local files in your text editor of choice.
Find where it says "YOUR_BOT_ID_HERE" and replace it with the ID of your new bot.

If you don't know what your Bot ID is, please refer back to [this](#get-bot-id) section,
where it is explained how to retrieve it.

If your Bot ID is 12345678910, then:

    BOT_ID="YOUR_BOT_ID_HERE"

becomes:

    BOT_ID="12345678910"
    
With this value set, the bot running in heroku should now be able to communicate with your group chat.

##  Your bot is now ready!

TCGprices should now be running in Heroku and is ready to respond to commands in your chat!
Configure the API requests and message formatting as you desrie (by default, it only searches the Yu-Gi-Oh! category)

# License
MIT license

Originally forked from GroupMe's helpful nodejs bot tutorial by Pete Mcgrath: 
https://github.com/groupme/bot-tutorial-nodejs (MIT License)
