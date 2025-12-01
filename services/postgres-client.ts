import postgres from 'postgres';

/**
 * Wrapper around pg.Client just to keep initialization clean.
 */
export default class PostgresClient
{
	private client: postgres.Sql<{}>;

	public constructor()
	{
		this.client = postgres();
	}

	public async query(query: string): Promise<object>
	{
		return await this.client`${query}`;
	}
}