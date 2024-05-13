import 'dotenv/config';
import express from 'express';
import coolAscii from 'cool-ascii-faces';
import DiscordClient from './discord/discord-client.js';
import Container from './container.js';
import generateDiscordCommands from './discord/discord-commands.js';

// Create services, etc.
const container = new Container();
const ex = express();
const disc = new DiscordClient();

// Add services to the DI container.
container.add('express', ex);
container.add('discord', disc);

// Express config.
ex.get('/ahoy', (req, res) => res.send(coolAscii()));
ex.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));

// Discord config.
disc.addCommands(generateDiscordCommands());
disc.login(process.env.DISCORD_TOKEN);