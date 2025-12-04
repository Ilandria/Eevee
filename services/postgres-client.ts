import { Client } from 'pg'

/**
 * Wrapper around pg.Client just to keep initialization clean.
 */
export default class PostgresClient
{
	public async query<T>(query: string): Promise<T[]>
	{
		const client = new Client();
		await client.connect();
		console.log(`Postgres running query: "${query}"`);
		const result = await client.query(query);
		console.log(`Postgres returned ${result.rows.length} results.`);
		await client.end();
		return result.rows as T[];
	}
}