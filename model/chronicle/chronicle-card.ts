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

	public toString(): string
	{
		return `${this.name} (${this.setCode} ${this.setNumber} ${this.rarity}) (${this.tenet} ${this.rune} ${this.types})`;
	}
}