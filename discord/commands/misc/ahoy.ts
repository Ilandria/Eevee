import coolAscii from 'cool-ascii-faces';
import DiscordCommand from '../../discord-command.js';
import findGreetingByCountry from 'native-greetings'

/**
 * Says hello to the user! This is mostly a bare-bones example on how to set up commands.
 * Note: Do not forget to create an instance of this in discord-commands.js!
 */
export default class AhoyCommand extends DiscordCommand
{
	/**
	 * Configures this.config (SlashCommandBuilder).
	 * @return A SlashCommandBuilder object that has been properly configured.
	 */
	configure()
	{
		this.config.setName('ahoy');
		this.config.setDescription('Replies with a probably-friendly greeting!');
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {*} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction: any)
	{
		await interaction.reply(`${findGreetingByCountry('Canada')} ${interaction.user.username}! ${coolAscii()}`);
	}
}