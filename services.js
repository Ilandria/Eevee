
export default class Services
{
	constructor()
	{
		this.services = new Map();
	}

	register(name, service)
	{
		if (this.services[name])
		{
			throw new Error(`Service with name ${name} is already registered in the application.`);
		}

		if (name && service)
		{
			this.services.set(name, service);
		}
	}

	find(name)
	{
		const service = this.services[name];

		if (!service)
		{
			throw new Error(`Service with name ${name} is not registered in the application.`);
		}

		return service;
	}
}