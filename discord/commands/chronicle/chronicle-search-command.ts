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
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {*} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction: any)
	{
		const result = await this.cardService.getAllCards();
		let reply = `There are currently ${result.length} cards in Chronicle:`

		result.forEach(card =>
		{
			reply += "\n * " + card.toString();
		});

		await interaction.reply(`${result}`);
	}
}