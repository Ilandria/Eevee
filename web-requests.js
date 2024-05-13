async function get(url)
{
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

module.exports = {
	get
};