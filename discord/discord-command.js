/**
 * Represents a slash command within Discord. See Discord developer documentation for info.
 * This is the base class and it's expected that and command will extend this class then override create() and execute().
 */
export default class DiscordCommand
{
	/**
	 * Builds the command object.
	 * @param {DiscordCommand} original Optional. If given, config and execution will be copied from this object.
	 */
	constructor(original = null)
	{
		if (original)
		{
			this.create = original.create;
			this.execute = original.execute;
		}

		this.config = this.create();

		console.log(`Initialized \"/${this.config.name}\" Discord command.`);
	}

	/**
	 * Creates a slash command definition with SlashCommandBuilder and return it.
	 * @return A SlashCommandBuilder object that has been properly configured.
	 */
	create()
	{
		throw new Error("create() must be overriden by a child class.");
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {Interaction} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction)
	{
		throw new Error("execute() must be overriden by a child class.");
	}
}