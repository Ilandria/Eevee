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

	public async getAllCards(): Promise<object>
	{
		return await this.databaseService.query('SELECT * FROM "eve-static".cards ORDER BY id ASC');
	}
}