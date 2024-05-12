const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

class DiscordClient
{
	constructor(clientId)
	{
		this.clientId = clientId;
		this.commands = new Collection();
		this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
		this.client.once(Events.ClientReady, client => this.onLoggedIn(client));
		this.client.on(Events.InteractionCreate, async interaction => this.onCommandExecuted(interaction));
	}

	login(token)
	{
		this.client.login(token);
	}

	addCommand(command)
	{
		if ('config' in command && 'execute' in command)
		{
			this.commands.set(command.config.name, command);
		}
		else
		{
			console.log(`The given command ${JSON.stringify(command)} is missing a required "config" or "execute" property.`);
		}
	}

	onLoggedIn(client)
	{
		console.log(`Ready! Logged in as ${client.user.tag}`);
	}

	async onCommandExecuted(interaction)
	{
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command)
		{
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try
		{
			await command.execute(interaction);
		}
		catch (error)
		{
			console.error(error);

			if (interaction.replied || interaction.deferred)
			{
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}
			else
			{
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
}

module.exports = {
	DiscordClient
};