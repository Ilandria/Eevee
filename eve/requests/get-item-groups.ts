import EveWebRequest from '../eve-web-request.js'

export default class GetItemGroupsRequest extends EveWebRequest
{
	name = "item-groups";
	route = "markets/groups";
	query = "";
	method = "get";
}