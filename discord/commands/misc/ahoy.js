import { SlashCommandBuilder } from 'discord.js';
import coolAscii from 'cool-ascii-faces';
import DiscordCommand from '../../discord-command.js';

/**
 * Says hello to the user! This is mostly a bare-bones example on how to set up commands.
 * Note: Do not forget to create an instance of this in discord-commands.js!
 */
export default class AhoyCommand extends DiscordCommand
{
	/**
	 * Creates a slash command definition with SlashCommandBuilder and return it.
	 * @return A SlashCommandBuilder object that has been properly configured.
	 */
	create()
	{
		return new SlashCommandBuilder()
			.setName('ahoy')
			.setDescription('Replies with a probably-friendly greeting!');
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {Interaction} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction)
	{
		await interaction.reply(`Ahoy ${interaction.user.username}! ${coolAscii()}`);
	}
}