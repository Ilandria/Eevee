/**
 * Caches data in memory (not database) for quick retrieval to avoid over-polling the Eve API.
 * Todo: Cache things to the DB when appropriate.
 */
export class EveRequestCache
{
	cache: Map<string, EveRequestData>
	defaultTtl: number

	/**
	 * Build an EveRequestCache.
	 * @param defaultTtl How long cached data should be considered valid for by default, in milliseconds (when not provided an explicit time).
	 */
	constructor(defaultTtl: number)
	{
		this.cache = new Map();
		this.defaultTtl = defaultTtl;
	}

	/**
	 * Retrieve named data from the cache.
	 * @param name The name of the data to retrieve.
	 * @returns The data if there is valid cached data, null otherwise.
	 */
	retrieve(name: string): any
	{
		let data: EveRequestData = this.cache[name];

		if (!data) return null;

		if (data.expiry < Date.now())
		{
			this.cache.delete(name);
			data = null;
		}

		return data;
	}

	/**
	 * Store named data within the cache.
	 * @param name The name of the data to store.
	 * @param data The data to store.
	 * @param expiry Optional. The date (in milliseconds since Jan 1st 1970 00:00:00 UTC) that the data should expire.
	 */
	store(name: string, data: any, expiry: number = null)
	{
		this.cache[name] = new EveRequestData(expiry != null ? expiry : Date.now() + this.defaultTtl, data);
	}
}

/**
 * Data object to track responses and expiry times.
 */
export class EveRequestData
{
	/**
	 * When this data is good until (in milliseconds since Jan 1st 1970 00:00:00 UTC).
	 */
	expiry: number

	/**
	 * Whatever is stored.
	 */
	data: any

	constructor(expiry: number, data: any)
	{
		this.expiry = expiry;
		this.data = data;
	}
}

export default
{
	EveRequestCache,
	EveRequestData
}