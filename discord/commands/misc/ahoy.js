import { SlashCommandBuilder } from 'discord.js';
import coolAscii from 'cool-ascii-faces';
import DiscordCommand from '../../discord-command.js';

export default class AhoyCommand extends DiscordCommand
{
	create()
	{
		return new SlashCommandBuilder()
			.setName('ahoy')
			.setDescription('Replies with a probably-friendly greeting!');
	}

	async execute(interaction)
	{
		await interaction.reply(`Ahoy ${interaction.user.username}! ${coolAscii()}`);
	}
}