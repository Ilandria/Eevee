require('dotenv').config();
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const coolAscii = require('cool-ascii-faces');
const DiscordClient = require('./discord-client.js');

const PORT = process.env.PORT || 5001

express()
	.get('/ahoy', (req, res) => res.send(coolAscii()))
	.listen(PORT, () => console.log(`Listening on ${PORT}`))

const client = new DiscordClient(process.env.DISCORD_CLIENT_ID);
client.login(process.env.DISCORD_TOKEN);

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders)
{
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.addCommand(command);
	}
}