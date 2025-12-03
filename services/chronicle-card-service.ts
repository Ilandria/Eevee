import ChronicleCard from "../model/chronicle/chronicle-card.js";
import PostgresClient from "./postgres-client.js";

/**
 * Card database service for Chronicle.
 */
export default class ChronicleCardService
{
	private databaseService: PostgresClient;

	constructor(databaseService: PostgresClient)
	{
		this.databaseService = databaseService;
	}

	public async getAllCards(): Promise<ChronicleCard[]>
	{
		const result = await this.databaseService.query('SELECT * FROM "eve-static".cards ORDER BY id ASC');
		const cards: ChronicleCard[] = result.map(cardData => Object.assign(new ChronicleCard(), cardData));
		return cards;
	}

	public async getCards(name: string): Promise<ChronicleCard[]>
	{
		let query: string = 'SELECT * FROM "eve-static".cards ';

		if (name)
		{
			query += `WHERE 'name' LIKE '%${name}%' `;
		}

		query += 'ORDER by id ASC;';

		const result = await this.databaseService.query(query);
		const cards: ChronicleCard[] = result.map(cardData => Object.assign(new ChronicleCard(), cardData));

		return cards;
	}
}