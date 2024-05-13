import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import generateDiscordCommands from '../discord-commands.js';

const commands = generateDiscordCommands().map(command => command.config.toJSON());
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try
	{
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
		console.log(`Successfully refreshed ${data.length} application (/) commands.`);
	}
	catch (error)
	{
		console.error(error);
	}
})();
