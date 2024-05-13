import AhoyCommand from "./commands/misc/ahoy.js";

export default function generateDiscordCommands()
{
	return [
		new AhoyCommand()
	];
}