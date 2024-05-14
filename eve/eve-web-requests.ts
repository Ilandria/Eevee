import GetMarketPricesRequest from './requests/get-market-prices.js';

/**
 * Generates an array containing an instance of every eve web request.
 * @returns The array of EveWebRequest objects.
 */
export default function generateEveWebRequests()
{
	const requests = [
		new GetMarketPricesRequest()
	];

	return requests;
}