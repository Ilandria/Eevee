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
		console.log(result[0]);
		const cards: ChronicleCard[] = [];
		return cards;
	}
}