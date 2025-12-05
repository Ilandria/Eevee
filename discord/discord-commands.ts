import ChronicleCardPainter from "../services/chronicle/chronicle-card-painter.js";
import ChronicleCardService from "../services/chronicle/chronicle-card-service.js";
import ChronicleGenerateCardCommand from "./commands/chronicle/chronicle-generate-card-command.js";
import ChronicleSearchCommand from "./commands/chronicle/chronicle-search-command.js";
import AhoyCommand from "./commands/misc/ahoy.js";

/**
 * Generates an array containing an instance of every user-accessible slash command.
 * @returns The array of DiscordCommand objects.
 */
export default function generateDiscordCommands(cardService: ChronicleCardService, cardPainter: ChronicleCardPainter)
{
	const commands = [
		new AhoyCommand(),
		new ChronicleSearchCommand(cardService, cardPainter),
		new ChronicleGenerateCardCommand(cardPainter)
	];

	return commands;
}