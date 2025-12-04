import DiscordCommand from '../../discord-command.js';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { CanvasRenderingContext2D, createCanvas, Image, loadImage, registerFont } from "canvas";
import { ChronicleRarity, ChronicleRune, ChronicleTenet } from "../../../model/chronicle/chronicle-enums.js";
import ChronicleCard from "../../../model/chronicle/chronicle-card.js";
import ChronicleComponentService from "../../../services/chronicle-component-service.js";
import coolAscii from 'cool-ascii-faces';
import https from 'https';
import fs from 'fs';

/**
 * Says hello to the user! This is mostly a bare-bones example on how to set up commands.
 * Note: Do not forget to create an instance of this in discord-commands.js!
 */
export default class ChronicleGenerateCardCommand extends DiscordCommand
{
	private componentService: ChronicleComponentService;

	constructor(componentService: ChronicleComponentService)
	{
		super();

		this.componentService = componentService;
	}

	/**
	 * Configures this.config (SlashCommandBuilder).
	 * @return A SlashCommandBuilder object that has been properly configured.
	 */
	configure()
	{
		this.config.setName('chron-gen-card');
		this.config.setDescription('Generate a high res Chronicle card from the Chronicle DB or given info.');
		this.config.addStringOption((option) => option.setName('name').setDescription('The name of the card.').setRequired(true));
		this.config.addStringOption((option) => option.setName('cost').setDescription('The myst cost of the card.').setRequired(true));
		this.config.addStringOption((option) =>	option.setName('rune').setDescription("The card's rune.").setRequired(true).addChoices(
			{ name: ChronicleRune[ChronicleRune.Herald], value: ChronicleRune[ChronicleRune.Herald] },
			{ name: ChronicleRune[ChronicleRune.Source], value: ChronicleRune[ChronicleRune.Source] },
			{ name: ChronicleRune[ChronicleRune.Form], value: ChronicleRune[ChronicleRune.Form] },
			{ name: ChronicleRune[ChronicleRune.Ritual], value: ChronicleRune[ChronicleRune.Ritual] },
			{ name: ChronicleRune[ChronicleRune.Burst], value: ChronicleRune[ChronicleRune.Burst] },
			{ name: ChronicleRune[ChronicleRune.Aura], value: ChronicleRune[ChronicleRune.Aura] },
			{ name: ChronicleRune[ChronicleRune.None], value: ChronicleRune[ChronicleRune.None] }));
			this.config.addStringOption((option) =>	option.setName('tenet').setDescription("The card's tenet.").setRequired(true).addChoices(
			{ name: ChronicleTenet[ChronicleTenet.Well], value: ChronicleTenet[ChronicleTenet.Well] },
			{ name: ChronicleTenet[ChronicleTenet.Torch], value: ChronicleTenet[ChronicleTenet.Torch] },
			{ name: ChronicleTenet[ChronicleTenet.Cloak], value: ChronicleTenet[ChronicleTenet.Cloak] },
			{ name: ChronicleTenet[ChronicleTenet.Shield], value: ChronicleTenet[ChronicleTenet.Shield] },
			{ name: ChronicleTenet[ChronicleTenet.Guile], value: ChronicleTenet[ChronicleTenet.Guile] },
			{ name: ChronicleTenet[ChronicleTenet.Valour], value: ChronicleTenet[ChronicleTenet.Valour] },
			{ name: ChronicleTenet[ChronicleTenet.Insight], value: ChronicleTenet[ChronicleTenet.Insight] },
			{ name: ChronicleTenet[ChronicleTenet.Fount], value: ChronicleTenet[ChronicleTenet.Fount] },
			{ name: ChronicleTenet[ChronicleTenet.None], value: ChronicleTenet[ChronicleTenet.None] }));
			this.config.addStringOption((option) => option.setName('art').setDescription("URL pointing to the card art (must be 1500 x 2100)."));
		this.config.addStringOption((option) =>	option.setName('rarity').setDescription("The card's rarity.").addChoices(
			{ name: ChronicleRarity[ChronicleRarity.Common], value: ChronicleRarity[ChronicleRarity.Common] },
			{ name: ChronicleRarity[ChronicleRarity.Uncommon], value: ChronicleRarity[ChronicleRarity.Uncommon] },
			{ name: ChronicleRarity[ChronicleRarity.Rare], value: ChronicleRarity[ChronicleRarity.Rare] },
			{ name: ChronicleRarity[ChronicleRarity.Special], value: ChronicleRarity[ChronicleRarity.Special] },
			{ name: ChronicleRarity[ChronicleRarity.None], value: ChronicleRarity[ChronicleRarity.None] }));
		this.config.addStringOption((option) => option.setName('types').setDescription("The card's types."));
		this.config.addStringOption((option) => option.setName('attack').setDescription("The card's attack."));
		this.config.addStringOption((option) => option.setName('defense').setDescription("The card's defense."));
		this.config.addStringOption((option) => option.setName('rules').setDescription("The card's rules text."));
		this.config.addStringOption((option) => option.setName('set-number').setDescription("The card's set number."));
		this.config.addStringOption((option) => option.setName('set-code').setDescription("The card's set code."));
		this.config.addStringOption((option) => option.setName('artist').setDescription("The card artist's name or handle."));
		this.config.addStringOption((option) => option.setName('copyright').setDescription("Extra copyright info for the card."));
	}

	/**
	 * Callback when a user runs this slash command.
	 * @param {*} interaction Contains the context in which the slash command was executed.
	 */
	async execute(interaction: any)
	{
		await interaction.deferReply();

		const card: ChronicleCard = Object.assign(new ChronicleCard(),
		{
			name: interaction.options.getString('name'),
			artUrl: interaction.options.getString('art') ?? "https://drive.google.com/uc?export=view&id=1HYDAkaJ0q_f3uq3nxtv3Z2sQvqKP8Sm7",
			artist: interaction.options.getString('artist'),
			copyright: interaction.options.getString('copyright'),
			setCode: interaction.options.getString('set-code'),
			setNumber: interaction.options.getString('set-number'),
			rune: interaction.options.getString('rune'),
			types: interaction.options.getString('types'),
			tenet: interaction.options.getString('tenet'),
			cost: interaction.options.getString('cost'),
			attack: interaction.options.getString('attack'),
			defense: interaction.options.getString('defense'),
			rules: interaction.options.getString('rules'),
			rarity: interaction.options.getString('rarity'),
			id: -1
		});

		const reply: DTO = await this.buildCard(card, async status => { await interaction.editReply(status); });
		await interaction.editReply({embeds: [reply.embed], files: [reply.attachment]});
	}

	private async buildCard(card: ChronicleCard, statusCallback: { (status: string): void; }): Promise<DTO>
	{
		// To do: All of this and the config section in configure() need to be moved out into a service somewhere. Guide here: https://www.youtube.com/watch?v=D1hWAIB6TWs
		statusCallback(`Preparing rune... ${coolAscii()}`);
		const canvas = createCanvas(1500, 2100);
		const context = canvas.getContext("2d");

		// Background card art.
		statusCallback(`Realizing rune art... ${coolAscii()}`);
		const cardArt = await loadImage(card.artUrl);
		context.drawImage(cardArt, 0, 0, canvas.width, canvas.height);

		// Card rules background.
		statusCallback(`Preparing inscription surface... ${coolAscii()}`);
		const rulesBgUrl = await this.componentService.getRulesBgUrl();
		const rulesBg = await loadImage(rulesBgUrl);
		context.font = `50px Garamond`;
		const lines: string[] = this.getLinesForParagraphs(context, card.rules, 900); // Need to get text early to know how high to draw the background.
		context.drawImage(rulesBg, 0, canvas.height - (393.75 + 65 * lines.length), canvas.width, canvas.height);

		// Card frame.
		statusCallback(`Etching tenets... ${coolAscii()}`);
		const frameUrl = await this.componentService.getTenetFrameUrl(card.tenet);
		const frame = await loadImage(frameUrl);
		context.drawImage(frame, 0, 0, canvas.width, canvas.height);

		// General font setup.
		statusCallback(`Scrawling rune words... ${coolAscii()}`);
		context.fillStyle = "white";
		context.textAlign = "center";
		context.shadowColor = "black";
		context.shadowBlur = 20;
		context.textBaseline = "middle";

		// Card name.
		context.font = `normal 900 80px Garamond`;
		context.fillText(card.name, canvas.width / 2, 90, 900);

		// Rune.
		context.font = `normal 400 120px Garamond`;
		context.fillText(`${card.rune as ChronicleRune}`.at(0), 150, 150);

		// Attack.
		if (card.attack) context.fillText(card.attack.toString(), canvas.width - 150, 150);

		// Defense.
		if (card.defense) context.fillText(card.defense.toString(), canvas.width - 150, canvas.height - 150);

		// Cost.
		context.fillText(card.cost.toString(), 150, canvas.height - 150);

		// Subtypes.
		context.font = `normal 400 40px Garamond`;
		context.fillText(card.types.toUpperCase(), canvas.width / 2, 155, 600);

		// Card meta setup.
		context.font = `30px Garamond`;
		context.textBaseline = "alphabetic";

		// Collection.
		context.textAlign = "left";
		context.fillText(`${(card.rarity as ChronicleRarity).toString().at(0)} ${card.setCode} ${card.setNumber}`, 337.5, canvas.height - 112.5, 225);

		// Artist.
		context.fillText(card.artist, 337.5, canvas.height - 75, 225);

		// Copyright.
		context.textAlign = "right";
		context.fillText(`©${card.copyright}`, canvas.width - 337.5, canvas.height - 112.5, 225);

		// Creator.
		context.fillText("Charlotte Brown", canvas.width - 337.5, canvas.height - 75, 225);

		// Rules.
		context.font = `50px Garamond`;
		context.textAlign = "left";
		for (let i: number = 0; i < lines.length; i++)
		{
			context.fillText(lines[i], 300, canvas.height - (300 + 65 * (lines.length - i - 1)), 900);
		}

		// Finalize card.
		statusCallback(`Sealing... ${coolAscii()}`);
		const reply: DTO = new DTO();
		let fileName = `${card.name}-${card.setCode}-${card.setNumber}`;
		fileName = fileName.trim().replace(/\s+/g, '-').toLowerCase();
		reply.embed = new EmbedBuilder().setImage(`attachment://${fileName}.png`);
		reply.attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {name: `${fileName}.png`});

		statusCallback(`Here's your rune! ${coolAscii()}`);
		return reply;
	}

	private getLinesForParagraphs(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[]
	{
		let paragraphs: string[] = text.split("\n");
		let lines: string[] = [];

		paragraphs.forEach(paragraph =>
		{
			let paragraphLines = this.getLines(context, paragraph, maxWidth);

			paragraphLines.forEach(line =>
			{
				lines.push(line);
			});
		});

		return lines;
	}

	private getLines(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[]
	{
		let words: string[] = text.split(" ");
		let lines: string[] = [];
		let currentLine: string = words[0];

		for (let i = 1; i < words.length; i++)
		{
			let word: string = words[i];
			let width = context.measureText(currentLine + " " + word).width;

			if (width < maxWidth)
			{
				currentLine += " " + word;
			}
			else
			{
				lines.push(currentLine);
				currentLine = word;
			}
		}

		lines.push(currentLine);
		return lines;
}
}

class DTO
{
	public embed: EmbedBuilder;
	public attachment: AttachmentBuilder;
}