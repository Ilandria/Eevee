import 'dotenv/config';
import express from 'express';
import coolAscii from 'cool-ascii-faces';
import DiscordClient from './discord/discord-client.js';
import Container from './system/container.js';
import generateDiscordCommands from './discord/discord-commands.js';
import PostgresClient from './postgres/postgres-client.js';
import EveWebClient from './eve/eve-web-client.js';
import generateEveWebRequests from './eve/eve-web-requests.js';

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

// Eve config.
const eve = new EveWebClient(process.env.EVE_API_ROOT);
eve.addWebRequests(generateEveWebRequests());
container.add('eve', eve);

// Express config.
const ex = express();
ex.get('/', (req, res) => res.send(`Hoooi! ${coolAscii()}`)); // Todo: Remove this test code.
ex.get('/adrenamite', (req, res) => res.send("./pages/adrenamite.html"));
ex.get('/api/item-groups', async (request, response) => response.send(JSON.stringify(await eve.execute("item-groups"))));
ex.get('/api/market-prices', async (request, response) => response.send(JSON.stringify(await eve.execute("market-prices"))));
ex.listen(process.env.PORT, () => console.log(`EXPRESS | Listening on ${process.env.PORT}`));
container.add('express', ex);