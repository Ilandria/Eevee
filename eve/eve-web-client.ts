import EveWebRequest from "./eve-web-request.js";
import {httpGet, httpPost} from "../web/web-requests.js";
import {EveRequestCache, EveRequestData} from "./eve-request-cache.js";

/**
 * Handles all of the high-level functions related to the Eve developer API and delegates tasks appropriately.
 */
export default class EveWebClient
{
	apiBaseUrl: string;
	requests: Map<string, EveWebRequest>;
	cache: EveRequestCache;

	constructor(apiBaseUrl: string)
	{
		this.apiBaseUrl = apiBaseUrl;
		this.requests = new Map();
		this.cache = new EveRequestCache(30000);
	}

	/**
	 * Add a configured web request to the client for later use.
	 * @param {EveWebRequest} eveWebRequest The EveWebRequest object defining how to run the request.
	 */
	addWebRequest(eveWebRequest: EveWebRequest)
	{
		const name = eveWebRequest.name;

		if (this.requests[name])
		{
			console.error(`EVE | A web request named \"${name}\" already exists.`);
		}

		console.log(`EVE | Adding request \"${name}\"`);
		this.requests[name] = eveWebRequest;
	}

	/**
	 * Add an array of web requests. Bulk call for addWebRequest.
	 * @param {EveWebRequest[]} webRequests The array of web request objects to be added.
	 */
	addWebRequests(webRequests: EveWebRequest[])
	{
		for (const webRequest of webRequests)
		{
			this.addWebRequest(webRequest);
		}
	}

	/**
	 * Run a previously-added EveWebRequest and await for the results.
	 * @param {string} name The name of the web request to run.
	 * @returns The web call result.
	 */
	async execute(name: string)
	{
		// Check and return data from the cache if it exists.
		const cachedData: EveRequestData = this.cache.retrieve(name);

		if (cachedData)
		{
			console.log(`EVE | Returning cached data for ${name}. Valid until ${new Date(cachedData.expiry).toString()}`);
			return cachedData.data;
		}

		// No valid cached data, run the web request.
		const request = this.requests[name];

		if (!request || !(request instanceof EveWebRequest))
		{
			console.error(`EVE | The EveWebRequest \"${name}\" does not exist or is missing members.`);
		}

		console.log(`EVE | Cache did not contain valid data for ${name}. Running web request.`);
		let url = `${this.apiBaseUrl}/${request.route}/?datasource=tranquility`;
		url = url.concat(request.query);
		let response: Promise<any>;

		// Todo: Convert this switch statement to some kind of command object pattern.
		switch(request.method.toLowerCase())
		{
			case "get":
				response = await httpGet(url);
				break;

			case "post":
				response = await httpPost(url, request.body);
				break;

			default:
				const error = new Error(`EVE | EveWebClient is not configured to handle \"${request.method}\" requests.`);
				console.error(error.message);
				throw new Error(error.message);
		}

		// Cache the result. Todo: If the Eve API provides a specific expiry time, use that instead of the default.
		this.cache.store(name, response);

		return response;
	}
}