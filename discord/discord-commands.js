import AhoyCommand from "./commands/misc/ahoy.js";

/**
 * Generates an array containing an instance of every user-accessible slash command.
 * @returns The array of DiscordCommand objects.
 */
export default function generateDiscordCommands()
{
	const commands = [
		new AhoyCommand()
	];

	return commands;
}