import GetMarketPricesRequest from './requests/get-market-prices.js';
import GetItemGroupsRequest from "./requests/get-item-groups.js";

/**
 * Generates an array containing an instance of every eve web request.
 * @returns The array of EveWebRequest objects.
 */
export default function generateEveWebRequests()
{
	const requests = [
		new GetMarketPricesRequest(),
		new GetItemGroupsRequest()
	];

	return requests;
}