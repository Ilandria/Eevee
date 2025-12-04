import { ChronicleRarity, ChronicleRune, ChronicleTenet } from "./chronicle-enums.js";

export default class ChronicleCard
{
	public name: string;
	public artUrl: string;
	public artist: string;
	public copyright: string;
	public setCode: string;
	public setNumber: number;
	public rune: number;
	public types: string;
	public tenet: number;
	public cost: number;
	public attack: number;
	public defense: number;
	public rules: string;
	public rarity: number;
	public id: number;

	public static getInfo(card: ChronicleCard): string
	{
		return `${card.name} (${card.setCode} #${card.setNumber} ${ChronicleRarity[card.rarity]}) (${ChronicleTenet[card.tenet]} ${ChronicleRune[card.rune]} ${card.types})`;
	}
}