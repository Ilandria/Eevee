const { SlashCommandBuilder } = require('discord.js');
const coolAscii = require('cool-ascii-faces');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ahoy')
		.setDescription('Replies with a probably-friendly greeting!'),
	async execute(interaction)
	{
		await interaction.reply(`Ahoy ${interaction.user.username}! ${coolAscii()}`);
	}
};