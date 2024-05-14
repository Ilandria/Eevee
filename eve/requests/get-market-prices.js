import EveWebRequest from '../eve-web-request.js'

export default class GetMarketPricesRequest extends EveWebRequest
{
	name = "market-prices";
	route = "markets/prices";
	query = "";
	method = "get";
}