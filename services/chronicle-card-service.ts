import PostgresClient from "./postgres-client.js";

/**
 * Card database service for Chronicle.
 */
export default class ChronicleCardService
{
	private static readonly cardTable = "\"eve-static\".cards";
	private databaseService: PostgresClient;

	constructor(databaseService: PostgresClient)
	{
		this.databaseService = databaseService;
	}

	public async getAllCards(): Promise<object>
	{
		return await this.databaseService.query(`SELECT * FROM ${ChronicleCardService.cardTable} ORDER BY id ASC`);
	}
}