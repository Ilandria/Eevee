import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import ChronicleCard from "../../model/chronicle/chronicle-card.js";
import DiscordEmbedDto from "../../model/discord/discord-embed-dto.js";
import { ChronicleRarity, ChronicleRune } from "../../model/chronicle/chronicle-enums.js";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import coolAscii from 'cool-ascii-faces';
import ChronicleComponentService from "./chronicle-component-service.js";

export default class ChronicleCardPainter
{
	private componentService: ChronicleComponentService;
	private static readonly rulesLineSpacing: number = 60;
	private static readonly rulesFontSize: number = 40;

	constructor(componentService: ChronicleComponentService)
	{
		this.componentService = componentService;
	}

	public async buildCard(card: ChronicleCard, statusCallback: { (status: string): void; }): Promise<DiscordEmbedDto>
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
		context.font = `${ChronicleCardPainter.rulesFontSize}px Garamond`;
		const lines: string[] = this.getLinesForParagraphs(context, card.rules, 900); // Need to get text early to know how high to draw the background.
		context.drawImage(rulesBg, 0, canvas.height - (393.75 + ChronicleCardPainter.rulesLineSpacing * lines.length), canvas.width, canvas.height);

		// Card frame.
		statusCallback(`Etching tenets... ${coolAscii()}`);
		const frameUrl = await this.componentService.getTenetFrameUrl(card.tenet);
		const frame = await loadImage(frameUrl);
		context.drawImage(frame, 0, 0, canvas.width, canvas.height);

		// General font setup.
		statusCallback(`Scrawling rune words... ${coolAscii()}`);

		// Card name.
		this.drawText(card.name, context, 80, canvas.width / 2, 85, 900, "center", 900, "middle");

		// Rune.
		this.drawText(`${ChronicleRune[card.rune]}`.at(0), context, 120, 150, 150, 300, "center", 600, "middle");

		// Attack.
		if (card.attack) this.drawText(card.attack.toString(), context, 120, canvas.width - 150, 150, 300, "center", 600, "middle");

		// Defense.
		if (card.defense) this.drawText(card.defense.toString(), context, 120, canvas.width - 150, canvas.height - 150, 300, "center", 600, "middle");

		// Cost.
		if (card.cost) this.drawText(card.cost.toString(), context, 120, 150, canvas.height - 150, 300, "center", 600, "middle");

		// Subtypes.
		this.drawText(card.types.toUpperCase(), context, 40, canvas.width / 2, 155, 600, "center", 400, "middle");

		// Collection.
		this.drawText(`${(card.rarity as ChronicleRarity).toString().at(0)} ${card.setCode} ${card.setNumber}`, context, 30, 337.5, canvas.height - 112.5, 225, "left", 300, "alphabetic");

		// Artist.
		this.drawText(card.artist, context, 30, 337.5, canvas.height - 75, 225, "left", 300, "alphabetic");

		// Copyright.
		this.drawText(`©${card.copyright}`, context, 30, canvas.width - 337.5, canvas.height - 112.5, 225, "right", 300, "alphabetic");

		// Creator.
		this.drawText("Charlotte C. Brown", context, 30, canvas.width - 337.5, canvas.height - 75, 225, "right", 300, "alphabetic");

		// Rules.
		context.font = `${ChronicleCardPainter.rulesFontSize}px Garamond`;
		context.textAlign = "left";
		for (let i: number = 0; i < lines.length; i++)
		{
			this.drawText(lines[i], context, ChronicleCardPainter.rulesFontSize, 300, canvas.height - (300 + ChronicleCardPainter.rulesLineSpacing * (lines.length - i - 1)), 900, "left", 300, "alphabetic");
		}

		// Finalize card.
		statusCallback(`Sealing... ${coolAscii()}`);
		const reply: DiscordEmbedDto = new DiscordEmbedDto();
		let fileName = `${card.name}-${card.setCode}-${card.setNumber}`;
		fileName = fileName.trim().replace(/\s+/g, '-').toLowerCase();
		reply.embed = new EmbedBuilder().setImage(`attachment://${fileName}.png`);
		reply.attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {name: `${fileName}.png`});

		statusCallback(`Here's your rune! ${coolAscii()}`);
		return reply;
	}

	private drawText(text: string, context: CanvasRenderingContext2D, fontSize: number, x: number, y: number, maxWidth: number, textAlign: CanvasTextAlign = "left", fontWeight: number = 300, textBaseline: CanvasTextBaseline = "alphabetic")
	{
		context.textAlign = textAlign;
		context.shadowColor = "black";
		context.shadowBlur = 20;
		context.textBaseline = textBaseline;

		context.font = `normal ${fontWeight} ${fontSize}px Garamond`;
		context.fillStyle = "black";
		context.fillText(text, x, y, maxWidth);

		context.font = `normal ${fontWeight} ${fontSize}px Garamond`;
		context.fillStyle = "white";
		context.fillText(text, x, y, maxWidth);
	}

	// To do: Bring these methods into a string formatting utility class.
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