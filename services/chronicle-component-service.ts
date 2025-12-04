import { ChronicleTenet } from "../model/chronicle/chronicle-enums.js";
import PostgresClient from "./postgres-client.js";

/**
 * Card database service for Chronicle.
 */
export default class ChronicleComponentService
{
	private databaseService: PostgresClient;

	constructor(databaseService: PostgresClient)
	{
		this.databaseService = databaseService;
	}

	public async getTenetFrameUrl(tenet: ChronicleTenet): Promise<string>
	{
		const tenetName: string = tenet.toString().toLowerCase();
		const result = await this.databaseService.query<DTO>(`SELECT * FROM "eve-static"."card-frame-components" WHERE component = 'frame-${tenetName}'`);
		return result[0].url;
	}

	public async getRulesBgUrl(): Promise<string>
	{
		const result = await this.databaseService.query<DTO>(`SELECT * FROM "eve-static"."card-frame-components" WHERE component = 'background-rules'`);
		return result[0].url;
	}
}

class DTO
{
	public component: string;
	public url: string;
}