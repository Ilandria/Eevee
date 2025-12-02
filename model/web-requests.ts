export async function httpGet(url: string)
{
	const response = await fetch(url,
	{
		method: "GET",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow",
		referrerPolicy: "no-referrer"
	});

	return response.json();
}

export async function httpPost(url: string, bodyObject = {})
{
	const response = await fetch(url,
	{
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow",
		referrerPolicy: "no-referrer",
		body: JSON.stringify(bodyObject)
	});

	return response.json();
}

export default
{
	httpGet,
	httpPost
}