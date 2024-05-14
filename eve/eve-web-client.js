import EveWebRequest from "./eve-web-request.js";
import {httpGet, httpPost} from "../web/web-requests.js";

/**
 * Handles all of the high-level functions related to the Eve developer API and delegates tasks appropriately.
 */
export default class EveWebClient
{
	constructor(apiBaseUrl)
	{
		this.apiBaseUrl = apiBaseUrl;
		this.requests = new Map();
	}

	/**
	 * Add a configured web request to the client for later use.
	 * @param {EveWebRequest} eveWebRequest The EveWebRequest object defining how to run the request.
	 */
	addWebRequest(eveWebRequest)
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
	addWebRequests(webRequests)
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
	async execute(name)
	{
		const request = this.requests[name];

		if (!request || !(request instanceof EveWebRequest))
		{
			console.error(`EVE | The EveWebRequest \"${name}\" does not exist or is missing members.`);
		}

		let url = `${this.apiBaseUrl}/${request.route}/?datasource=tranquility`;
		url = url.concat(request.query);
		let response;

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
				throw new Error(error);
		}

		return response;
	}
}