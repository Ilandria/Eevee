require('dotenv').config()
const express = require('express')
const path = require('path')
const coolAscii = require('cool-ascii-faces');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const PORT = process.env.PORT || 5001

express()
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.get('/ahoy', (req, res) => res.send(coolAscii()))
	.listen(PORT, () => console.log(`Listening on ${PORT}`))

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient =>
{
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);