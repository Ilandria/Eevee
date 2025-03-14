import { Client, Collection, Events, GatewayIntentBits, Interaction } from 'discord.js';
import DiscordCommand from './discord-command.js';

/**
 * Handles all of the high-level functions of the Discord client and delegating commands.
 */
export default class DiscordClient
{
	commands: Collection<string, DiscordCommand>;
	client: Client<boolean>;

	constructor()
	{
		this.commands = new Collection();
		this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
		this.client.once(Events.ClientReady, client => this.onLoggedIn(client));
		this.client.on(Events.InteractionCreate, async interaction => this.onCommandExecuted(interaction));
	}

	/**
	 * Log this client in to Discord.
	 * @param {string} token Access token.
	 */
	login(token: string)
	{
		this.client.login(token);
	}

	/**
	 * Add a definition for a slash command.
	 * @param {DiscordCommand} command the command object to be added.
	 */
	addCommand(command: DiscordCommand)
	{
		if (command instanceof DiscordCommand)
		{
			this.commands.set(command.config.name, command);
		}
		else
		{
			console.log('DISCORD | Tried to add a command object that is not a DiscordCommand');
		}
	}

	/**
	 * Add an array of slash command definitions. Bulk call for addCommand.
	 * @param {DiscordCommand[]} commands The array of command objects to be added.
	 */
	addCommands(commands: DiscordCommand[])
	{
		for (const command of commands)
		{
			this.addCommand(command);
		}
	}

	/**
	 * Called once when the client logs in.
	 * @param {Client} client The client which logged in successfully.
	 */
	onLoggedIn(client: Client)
	{
		console.log(`DISCORD | Logged in as ${client.user.tag}`);
	}

	/**
	 * Raised whenever a user issues a slash command from Discord.
	 * @param {*} interaction Context of the slash command used.
	 */
	async onCommandExecuted(interaction: Interaction)
	{
		if (!interaction.isChatInputCommand()) return;

		const command = this.commands.get(interaction.commandName);

		if (!command)
		{
			console.error(`DISCORD | No command matching ${interaction.commandName} was found.`);
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