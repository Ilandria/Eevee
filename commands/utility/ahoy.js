const { SlashCommandBuilder } = require('discord.js');
const coolAscii = require('cool-ascii-faces');

const config = new SlashCommandBuilder()
.setName('ahoy')
.setDescription('Replies with a probably-friendly greeting!');

async function execute(interaction)
{
	await interaction.reply(`Ahoy ${interaction.user.username}! ${coolAscii()}`);
}

module.exports = {
	config,
	execute
};