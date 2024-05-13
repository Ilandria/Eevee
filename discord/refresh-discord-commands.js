import { REST, Routes } from 'discord.js';

export default function refreshDiscordCommands(commands, clientId, token)
{
	const commandConfigs = [];

	for (const discordCommand in commands)
	{
		commandConfigs.push(discordCommand.config.toJSON());
	}

	const rest = new REST().setToken(token);

	(async () => {
		try
		{
			console.log(`Started refreshing ${commandConfigs.length} application (/) commands.`);

			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(Routes.applicationCommands(clientId), { body: commandConfigs });

			console.log(`Successfully refreshed ${data.length} application (/) commands.`);
		}
		catch (error)
		{
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
}