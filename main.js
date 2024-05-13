import 'dotenv/config';
import express from 'express';
import coolAscii from 'cool-ascii-faces';
import DiscordClient from './discord/discord-client.js';
import Container from './container.js';
import generateDiscordCommands from './discord/discord-commands.js';
import PostgresClient from './postgres-client.js';

const container = new Container();

// Postgres config.
const postgres = new PostgresClient(process.env.DATABASE_URL);
postgres.connect();
container.add('database', postgres);

// Discord config.
const disc = new DiscordClient();
disc.addCommands(generateDiscordCommands());
disc.login(process.env.DISCORD_TOKEN);
container.add('discord', disc);

// Express config.
const ex = express();
ex.get('/ahoy', (req, res) => res.send(coolAscii()));
ex.listen(process.env.PORT, () => console.log(`EXPRESS | Listening on ${process.env.PORT}`));
container.add('express', ex);