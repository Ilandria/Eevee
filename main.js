import 'dotenv/config';
import express from 'express';
import coolAscii from 'cool-ascii-faces';
import DiscordClient from './discord/discord-client.js';
import Services from './services.js';
import refreshDiscordCommands from './discord/refresh-discord-commands.js';
import AhoyCommand from './discord/commands/misc/ahoy.js';

const services = new Services();
const ex = express();
const disc = new DiscordClient();

services.register('express', ex);
services.register('discord', disc);

ex.get('/ahoy', (req, res) => res.send(coolAscii()));
ex.get('/refresh-discord-commands', (req, res) => refreshDiscordCommands(disc.getCommandConfigJSONArray(), process.env.DISCORD_CLIENT_ID, process.env.DISCORD_TOKEN));
ex.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));

disc.addCommand(new AhoyCommand());
disc.login(process.env.DISCORD_TOKEN);