import OpenAI from "openai";

// To do: This should be injected.
const client = new OpenAI();

export async function helloOpenAI(): Promise<string>
{
	const response = await client.responses.create({
		model: "gpt-4.1-nano",
		input: "Please say 'hello world' if you see this!"
	});

	console.log(response.output_text);

	return response.output_text;
}