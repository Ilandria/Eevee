import pg from 'pg';
const { Client } = pg;

/**
 * Wrapper around pg.Client just to keep initialization clean.
 */
export default class PostgresClient
{
	client: any;

	constructor(connectionString: string)
	{
		this.client = new Client({
			connectionString: connectionString
		});

		this.client.on('error', error =>
		{
			console.error(`POSTGRES | Encountered an error.`, error.stack);
		})
	}

	/**
	 * Connects to the PG DB and runs a simple query to validate everything is as expected.
	 */
	connect()
	{
		this.client.connect();
		console.log('POSTGRES | Connected.');

		this.client.query('SELECT table_schema,table_name FROM information_schema.tables;', (error, result) =>
		{
			if (error) throw error;

			for (let row of result.rows)
			{
				console.log(`POSTGRES | ${JSON.stringify(row)}`);
			}
		});
	}

	/**
	 * Terminates the DB connection.
	 */
	disconnect()
	{
		this.client.end();
	}
}