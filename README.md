# msbl-gearbuilder-bot
Discord bot that finds Mario Strikers: Battle League builds matching given stats. \
This is a WIP.
# How to use
Make sure Node.js is installed on your machine. \
You need to have these npm packages:
* @discordjs/rest
* discord-api-types/v9
* @discordjs/builders
* multimap
* discord.js

After cloning the repo, edit the first 3 lines of msbl-gear-bot.js to contain your bot's token, your guild ID, and your bot's client ID. \
As with all discord bots, you'd need to [authorize](https://discord.com/developers/docs/topics/oauth2) it. \
Run msbl-gear-bot.js. Hopefully, if all goes well, the slash commands would be registered to the server. \
Try ```/gear``` and ```/gearrules``` to test the bot. \
And that's basically it.
