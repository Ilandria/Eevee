/**
 * Represents a slash command within Discord. See Discord developer documentation for info.
 */
export default class DiscordCommand
{
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
	 * @param {*} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction)
	{
		throw new Error("execute() must be overriden by a child class.");
	}
}