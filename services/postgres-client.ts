import postgres from 'postgres';

/**
 * Wrapper around pg.Client just to keep initialization clean.
 */
export default class PostgresClient
{
	private client: postgres.Sql<{}>;

	public constructor()
	{
		this.client = postgres("postgres://u366esdu7hb2qq:p201b0f8b3e77fd0d8586bddbe7a69ffa1dd58c9d678f0e61d78c99de3daae091@c5hilnj7pn10vb.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d1g2d3ik5bc2jk");
	}

	public async query(query: string): Promise<object>
	{
		return await this.client`${query}`;
	}
}