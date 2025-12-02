import { Client } from 'pg'


/**
 * Wrapper around pg.Client just to keep initialization clean.
 */
export default class PostgresClient
{
	public async query(query: string): Promise<object[]>
	{
		const client = new Client();
		await client.connect();
		const result = await client.query(query);
		await client.end();
		return result.rows;
	}
}