import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, ILike, Not, Repository } from "typeorm";
import { NewData } from "./models/data/NewsData";
import { CreateNewDto } from "./models/requests/CreateNewDto";
import { UpdateNewDto } from "./models/requests/UpdateNewDto";

@Injectable()
export class NewsService {

    private _logger: Logger;

    constructor(
        @InjectRepository(NewData) private _newsRepo: Repository<NewData>,
    ){
        this._logger = new Logger(NewsService.name);
    }

    // Get all news
    async getAllNews() : Promise<Array<NewData>> {
        try {
            const news = await this._newsRepo.find();
            return news;
        }
        catch(error){
            this._logger.error(`News could not be obtained: ${JSON.stringify(error)}`)
            return [];
        }
    }

    // Get available news
    async getAvailableNews() : Promise<Array<NewData>> {
        try {
            const news = await this._newsRepo.findBy({
                available: true
            });
            return news;
        }
        catch(error){
            this._logger.error(`Available news could not be obtained: ${JSON.stringify(error)}`);
            return [];
        }
    }

    // Create new
    async createNew(request: CreateNewDto) {
        try {
            const createdNew = await this._newsRepo.save({
                ...request,
                available: true
            });
            return createdNew;
        }
        catch(error){
            this._logger.error(`New was not created: ${error}`);
            return null;
        }
    }

    // Update new
    async edit(request: UpdateNewDto){
        try {
            const foundNew = await this._newsRepo.findOneBy({
                id: request.id
            });
                
            if(!foundNew)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
    
            foundNew.title = request.title;
            foundNew.description = request.description;
            foundNew.image = request.image;
            foundNew.updated_at = new Date();

            await this._newsRepo.save(foundNew);
            return true;
        }
        catch(error){
            this._logger.error(`EDIT: ${JSON.stringify(error)}`);
            return null;
        }
    }

    // Delete new
    async deleteNew(newId: number){
        try {
            const newData = await this._newsRepo.findOneBy({
                id: newId
            });
            
            if(!newData)
                return null;

            newData.available = false;
            newData.updated_at = new Date();
            await this._newsRepo.save(newData);
            return true;
        }
        catch(error){
            this._logger.error(`DELETE: ${JSON.stringify(error)}`);
            return null;
        }
    }
}