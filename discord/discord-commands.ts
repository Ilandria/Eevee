import ChronicleCardService from "../services/chronicle-card-service.js";
import ChronicleComponentService from "../services/chronicle-component-service.js";
import ChronicleGenerateCardCommand from "./commands/chronicle/chronicle-generate-card-command.js";
import ChronicleSearchCommand from "./commands/chronicle/chronicle-search-command.js";
import AhoyCommand from "./commands/misc/ahoy.js";

/**
 * Generates an array containing an instance of every user-accessible slash command.
 * @returns The array of DiscordCommand objects.
 */
export default function generateDiscordCommands(cardService: ChronicleCardService = null, componentService: ChronicleComponentService = null)
{
	const commands = [
		new AhoyCommand(),
		new ChronicleSearchCommand(cardService),
		new ChronicleGenerateCardCommand(componentService)
	];

	return commands;
}