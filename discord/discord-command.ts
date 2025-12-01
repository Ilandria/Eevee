import { SlashCommandBuilder } from 'discord.js';

/**
 * Represents a slash command within Discord. See Discord developer documentation for info.
 * This is the base class and it's expected that and command will extend this class then override create() and execute().
 */
export default class DiscordCommand
{
	create: any;
	config: SlashCommandBuilder;

	/**
	 * Builds the command object.
	 */
	constructor()
	{
		this.config = new SlashCommandBuilder();
		this.configure();

		console.log(`DISCORD | Created \"/${this.config.name}\".`);
	}

	/**
	 * Configures this.config (SlashCommandBuilder).
	 * @return A SlashCommandBuilder object that has been properly configured.
	 */
	configure()
	{
		throw new Error("DISCORD | create() must be overriden by a child class.");
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {*} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction: any)
	{
		throw new Error("DISCORD | execute() must be overriden by a child class.");
	}
}