import ChronicleCard from "../../../model/chronicle/chronicle-card.js";
import DiscordEmbedDto from "../../../model/discord/discord-embed-dto.js";
import ChronicleCardPainter from "../../../services/chronicle/chronicle-card-painter.js";
import ChronicleCardService from "../../../services/chronicle/chronicle-card-service.js";
import DiscordCommand from '../../discord-command.js';

/**
 * Says hello to the user! This is mostly a bare-bones example on how to set up commands.
 * Note: Do not forget to create an instance of this in discord-commands.js!
 */
export default class ChronicleSearchCommand extends DiscordCommand
{
	private cardService: ChronicleCardService;
	private cardPainter: ChronicleCardPainter;

	constructor(cardService: ChronicleCardService, cardPainter: ChronicleCardPainter)
	{
		super();

		this.cardService = cardService;
		this.cardPainter = cardPainter;
	}

	/**
	 * Configures this.config (SlashCommandBuilder).
	 * @return A SlashCommandBuilder object that has been properly configured.
	 */
	configure()
	{
		this.config.setName('chron-search');
		this.config.setDescription('Search the Chronicle card database.');
		this.config.addStringOption((option) => option.setName('name').setDescription('A whole or partial name to search for.'));
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {*} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction: any)
	{
		await interaction.deferReply();

		const nameOption: string = interaction.options.getString('name');

		const result: ChronicleCard[] = await this.cardService.getCards(nameOption);
		let reply: string = `${result.length} card(s) found:`;

		if (result.length != 1)
		{
			result.forEach((card: ChronicleCard) =>
			{
				reply = `${reply}\n * ${ChronicleCard.getInfo(card)}`;
			});

			await interaction.editReply(reply);
		}
		else
		{
			const reply: DiscordEmbedDto = await this.cardPainter.buildCard(result[0], async status => { await interaction.editReply(status); });
			await interaction.editReply({embeds: [reply.embed], files: [reply.attachment]});
		}

	}
}