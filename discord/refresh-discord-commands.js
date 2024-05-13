import { REST, Routes } from 'discord.js';

export default function refreshDiscordCommands(commands, clientId, token)
{
	const commandConfigs = [];

	for (const discordCommand in commands)
	{
		commandConfigs.push(discordCommand.config.toJSON());
		console.log(`Preparing to refresh \"/${discordCommand.config.name}\"`);
	}

	const rest = new REST().setToken(token);

	(async () => {
		try
		{
			console.log(`Started refreshing ${commandConfigs.length} application (/) commands.`);
			const data = await rest.put(Routes.applicationCommands(clientId), { body: commandConfigs });
			console.log(`Successfully refreshed ${data.length} application (/) commands.`);
		}
		catch (error)
		{
			console.error(error);
		}
	})();
}