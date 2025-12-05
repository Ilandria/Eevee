import { AttachmentBuilder, EmbedBuilder } from "discord.js";

export default class DiscordEmbedDto
{
	public embed: EmbedBuilder;
	public attachment: AttachmentBuilder;
}