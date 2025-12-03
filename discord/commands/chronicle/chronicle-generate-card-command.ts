import ChronicleCardService from "../../../services/chronicle-card-service.js";
import DiscordCommand from '../../discord-command.js';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { createCanvas, Image } from "canvas";

/**
 * Says hello to the user! This is mostly a bare-bones example on how to set up commands.
 * Note: Do not forget to create an instance of this in discord-commands.js!
 */
export default class ChronicleGenerateCardCommand extends DiscordCommand
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
		this.config.setName('chron-gen-card');
		this.config.setDescription('Generate a high res Chronicle card from the Chronicle DB or given info.');
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {*} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction: any)
	{
		await interaction.deferReply();

		const canvas = createCanvas(1500, 2100);
		const context = canvas.getContext("2d");
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		const cardArt = new Image();
		cardArt.src = "https://drive.google.com/uc?export=view&id=1b_1mLR3ovcVcxzVM9by3vm62iJBUYLpb";

		cardArt.onload = async function ()
		{
			context.drawImage(cardArt, 0, 0, cardArt.width, cardArt.height);

			const buffer = canvas.toBuffer("image/png");
			const attachment = new AttachmentBuilder(buffer, {name: "card.png"});

			const embed = new EmbedBuilder().setImage("attachment://card.png")

			await interaction.editReply({embeds: [embed], files: [attachment]});
		};
	}
}