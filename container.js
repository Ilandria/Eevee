/**
 * Basic DI container for the application.
 */
export default class Container
{
	constructor()
	{
		this.registry = new Map();
	}

	add(name, object)
	{
		if (this.registry[name])
		{
			throw new Error(`Service with name ${name} is already registered in the application.`);
		}

		if (name && object)
		{
			this.registry.set(name, object);
		}
	}

	find(name)
	{
		const object = this.registry[name];

		if (!object)
		{
			throw new Error(`Service with name ${name} is not registered in the application.`);
		}

		return object;
	}
}