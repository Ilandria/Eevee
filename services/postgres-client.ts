import { Client } from 'pg'


/**
 * Wrapper around pg.Client just to keep initialization clean.
 */
export default class PostgresClient
{
	private client;

	public constructor()
	{
		this.client = new Client();
	}

	public async query(query: string): Promise<object[]>
	{
		await this.client.connect();
		const result = await this.client.query(query);
		await this.client.end();
		return result.rows;
	}
}