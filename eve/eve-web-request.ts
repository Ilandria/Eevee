/**
 * Represents a web request for Eve Online. See the Eve swagger docs for info.
 * This is the base class and it's expected that a web request will extend this class then override each property.
 */
export default class EveWebRequest
{
	constructor()
	{

	}

	/**What this will be referred to when running queries via the web client. */
	name = "";

	/**Path relative to the api root. Do not add a leading or trailing slashes (/). */
	route = "";

	/**Lead the query string with & as other params are already being sent and this is appended to the url. */
	query = "";

	/**HTTP verbs, all lower-case. */
	method = "";

	/**Used for appropriate verbs, ignored otherwise. */
	body = {};
}