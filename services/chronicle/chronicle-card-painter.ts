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
		context.fillText(card.name, canvas.width / 2, 85, 900);

		// Rune.
		context.font = `normal 600 120px Garamond`;
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
		context.font = `40px Garamond`;
		context.textAlign = "left";
		for (let i: number = 0; i < lines.length; i++)
		{
			context.fillText(lines[i], 300, canvas.height - (300 + 65 * (lines.length - i - 1)), 900);
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