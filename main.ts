import 'dotenv/config';
import path from "path";
import { fileURLToPath } from 'url';
import express from 'express';
import coolAscii from 'cool-ascii-faces';
import DiscordClient from './discord/discord-client.js';
import Container from './system/container.js';
import generateDiscordCommands from './discord/discord-commands.js';
import PostgresClient from './services/postgres-client.js';
import EveWebClient from './eve/eve-web-client.js';
import generateEveWebRequests from './eve/eve-web-requests.js';
import ChronicleCardService from "./services/chronicle-card-service.js";
import ChronicleComponentService from "./services/chronicle-component-service.js";

const container = new Container();

// Postgres config.
const postgres = new PostgresClient();
container.add('database', postgres);

// Chronicle config.
const cardService = new ChronicleCardService(postgres);
container.add('chronicleCardService', cardService);
const componentService = new ChronicleComponentService(postgres);
container.add('chronicleComponentService', componentService);

// Discord config.
const disc = new DiscordClient();
disc.addCommands(generateDiscordCommands(cardService, componentService));
disc.login(process.env.DISCORD_TOKEN);
container.add('discord', disc);

// Eve config.
const eve = new EveWebClient(process.env.EVE_API_ROOT);
eve.addWebRequests(generateEveWebRequests());
container.add('eve', eve);

// Express config.
const ex = express();
ex.set("view engine", "ejs");
ex.set("views", path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../"), "pages/views"));
ex.get('/', (req, res) => res.send(`Hoooi! ${coolAscii()}`)); // Todo: Remove this test code.
ex.get('/faces', (req, res) => res.send(`${coolAscii()} ${coolAscii()} ${coolAscii()} ${coolAscii()} ${coolAscii()} ${coolAscii()} ${coolAscii()} ${coolAscii()} ${coolAscii()} ${coolAscii()} `)); // Todo: Remove this test code.
ex.get('/adrenamite', (req, res) => res.render("adrenamite"));
ex.get('/kryojyn', (req, res) => res.render("kryojyn"));
ex.get('/api/item-groups', async (request, response) => response.send(JSON.stringify(await eve.execute("item-groups"))));
ex.get('/api/market-prices', async (request, response) => response.send(JSON.stringify(await eve.execute("market-prices"))));
ex.listen(process.env.PORT, () => console.log(`EXPRESS | Listening on ${process.env.PORT}`));
container.add('express', ex);