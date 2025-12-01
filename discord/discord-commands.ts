import ChronicleCardService from "../services/chronicle-card-service.js";
import ChronicleSearchCommand from "./commands/chronicle/chronicle-search-command.js";
import AhoyCommand from "./commands/misc/ahoy.js";

/**
 * Generates an array containing an instance of every user-accessible slash command.
 * @returns The array of DiscordCommand objects.
 */
export default function generateDiscordCommands(cardService: ChronicleCardService)
{
	const commands = [
		new AhoyCommand(),
		new ChronicleSearchCommand(cardService)
	];

	return commands;
}