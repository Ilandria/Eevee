/**
 * Basic DI container for the application.
 */
export default class Container
{
	registry: Map<string, any>;

	constructor()
	{
		this.registry = new Map();
	}

	add(name, object)
	{
		if (this.registry[name])
		{
			throw new Error(`SYSTEM | Service with name ${name} is already registered in the application.`);
		}

		if (name && object)
		{
			this.registry.set(name, object);
			console.log(`SYSTEM | Added ${name} to the registry.`);
		}
	}

	find(name)
	{
		const object = this.registry[name];

		if (!object)
		{
			throw new Error(`SYSTEM | Service with name ${name} is not registered in the application.`);
		}

		return object;
	}
}