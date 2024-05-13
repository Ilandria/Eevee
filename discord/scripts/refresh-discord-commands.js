/*
Ran via npm run refresh-discord to update all slash commands registered for the Discord bot.
*/
import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import generateDiscordCommands from '../discord-commands.js';

const commands = generateDiscordCommands().map(command => command.config.toJSON());
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try
	{
		console.log(`DISCORD | Started refreshing ${commands.length} commands.`);
		const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
		console.log(`DISCORD | Successfully refreshed ${data.length} commands.`);
	}
	catch (error)
	{
		console.error(error);
	}
})();
