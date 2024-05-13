import 'dotenv/config';
import express from 'express';
import coolAscii from 'cool-ascii-faces';
import DiscordClient from './discord/discord-client.js';
import Services from './services.js';
import generateDiscordCommands from './discord/discord-commands.js';

const services = new Services();
const ex = express();
const disc = new DiscordClient();

services.register('express', ex);
services.register('discord', disc);

ex.get('/ahoy', (req, res) => res.send(coolAscii()));
ex.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));

disc.addCommands(generateDiscordCommands());
disc.login(process.env.DISCORD_TOKEN);