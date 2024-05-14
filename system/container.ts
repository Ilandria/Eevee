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

	/**
	 * Add an object to the container and give it a name for later access.
	 * @param name The name to register.
	 * @param object The object to register.
	 */
	add(name: string, object: any)
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

	/**
	 * Find an object by the name given in add().
	 * @param name The object to find by name.
	 * @returns The registered object.
	 */
	find(name: string)
	{
		const object = this.registry[name];

		if (!object)
		{
			throw new Error(`SYSTEM | Service with name ${name} is not registered in the application.`);
		}

		return object;
	}
}