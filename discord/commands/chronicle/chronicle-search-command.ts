import ChronicleCard from "../../../model/chronicle/chronicle-card.js";
import { ChronicleRune, ChronicleTenet } from "../../../model/chronicle/chronicle-enums.js";
import ChronicleCardService from "../../../services/chronicle-card-service.js";
import DiscordCommand from '../../discord-command.js';

/**
 * Says hello to the user! This is mostly a bare-bones example on how to set up commands.
 * Note: Do not forget to create an instance of this in discord-commands.js!
 */
export default class ChronicleSearchCommand extends DiscordCommand
{
	private cardService: ChronicleCardService;

	constructor(cardService: ChronicleCardService)
	{
		super();

		this.cardService = cardService;
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

		result.forEach((card: ChronicleCard) =>
		{
			reply = `${reply}\n * ${card.getInfo()}`;
		});

		await interaction.editReply(reply);
	}
}