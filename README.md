# TCGprices

## Introduction

TCGprices is  chatbot for use in GroupMe chatrooms. Created in Node.js and hosted on Heroku, the bot is able to respond to pricing requests from GroupMe chatroom messages for any tcg product listed on the popular hobby retailer TCGplayer by utilizing their TCGAPI Endpoints. It can respond with live pricing data sorted in various ways or link directly to TCGplayer's search page for the desired product.

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

## Add your Bot-ID and more in the Heroku app: <a name="config-vars"></a>

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


## TCGAPI Configuration

To take full utilization of this application's commands, you will also need to join the TCGplayer Developer Network for access to the TCGAPI: http://developer.tcgplayer.com/developer-application-form.html

Command /link will still work without being in the TCGplayer Developer Network, but the other commands will result in error.

Once accepted, you should opt to similarly create *Config Vars* [as shown previously](#config-vars) for other values in Heroku such as:

 | Key | Value |
| --- | --- |
| PUBLIC_KEY | your public key received from TCGplayer |
| PRIVATE_KEY | your private key received from TCGplayer |
| BEARER_TOKEN | your authorization token requested from TCGAPI |
| TCG_VERSION | Desired API version of TCGAPI |

If not created in Heroku, these values must be created in a local `.env` file pricing commands to work.
`.env` is gitignored by default, so if you wish this to be active in the heroku app, it must be removed from from .gitignore first.
WARNING: You will likely not want these `.env` values public in your repositoty as your developer key is sensitive information, so I advise just configuring them in your private heroku app as described above instead.


# Configuring your Bot Locally (Optional)<a name="local"></a>

## Pull the code to your local machine

Within terminal, change directory to the location where you would like the files to live, then run this command:

    $ heroku git:clone -a YOUR_APP_NAME_HERE

And then change directory into the new folder

    $ cd YOUR_APP_NAME_HERE

## Configuring your Environment Variables

(Optional)
If you wish to test locally, you can save local variables for your BOT-ID and all TCGAPI values in a local file `.env` for the purpose of running the app locally on your computer. 
Note that the app will not receive callback messages from the GroupMe chat it resides in without a local tunnel, which would have to be set up into this bot by you (I unfortunately have not implemented this yet). 

While helpful for fast testing without the need to constantly commit and push to Heroku, it is a bit of an ugly workaround.


##  Your bot is now ready!

TCGprices should now be running in Heroku and is ready to respond to commands in your chat!
Configure the API requests and message formatting as you desire (by default, it only searches the Yu-Gi-Oh! category)

# License
MIT license

Originally forked from GroupMe's helpful nodejs bot tutorial by Pete Mcgrath: 
https://github.com/groupme/bot-tutorial-nodejs (MIT License)
