const { SlashCommandBuilder } = require('discord.js');
const { get } = require('../../web-requests.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-orders')
		.setDescription('Get market orders for a given item in a region in Eve.')
		.addStringOption(option => option.setName('region').setDescription('The id of the region to check.').setRequired(true))
		.addIntegerOption(option => option.setName('type').setDescription('The type of item to check.').setRequired(true)),
	async execute(interaction)
	{
		const region = interaction.options.getString('region');
		const type = interaction.options.getInteger('type');

		const result = await get(`https://esi.evetech.net/markets/${region}/orders/?type_id=${type}`)
		await interaction.reply(`${JSON.stringify(result)}`);
	}
};