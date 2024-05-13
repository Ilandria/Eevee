import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import DiscordCommand from './discord-command.js';

export default class DiscordClient
{
	constructor()
	{
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
		if (command instanceof DiscordCommand)
		{
			this.commands.set(command.config.name, command);
		}
		else
		{
			console.log('Tried to add a command object that is not a DiscordCommand');
		}
	}

	addCommands(commands)
	{
		for (const command in commands)
		{
			this.addCommand(command);
		}
	}

	onLoggedIn(client)
	{
		console.log(`Ready! Logged in as ${client.user.tag}`);
	}

	async onCommandExecuted(interaction)
	{
		if (!interaction.isChatInputCommand()) return;

		const command = this.commands.get(interaction.commandName);

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