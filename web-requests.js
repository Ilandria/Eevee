async function get(url)
{
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

module.exports = {
	get
};