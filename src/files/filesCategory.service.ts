import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, ILike, Not, Repository } from "typeorm";
import { FileCategoryData } from "./models/data/FileCategoryData";
import { CreateFileCategoryDto } from "./models/requests/CreateFileCategoryDto";

@Injectable()
export class FileCategoryService {

    _logger: Logger;

    constructor(
        @InjectRepository(FileCategoryData) private _fileCategoryRepository: Repository<FileCategoryData>
    ){
        this._logger = new Logger(FileCategoryService.name);
    }

    async getAll(){
        try {
            const categories = await this._fileCategoryRepository.find();
            return categories;
        }
        catch(error){
            this._logger.error("No se han podido obtener las categorías de archivos");
            return [];
        }
    }

    async create(request: CreateFileCategoryDto){
        try {
            // Validate if name exists
            const duplicated = await this._fileCategoryRepository.findOne({
                where: {
                    name: ILike(`${request.name}`)
                }
            });

            if(duplicated)
                return { code: HttpStatus.BAD_REQUEST, msg: "There is already a category with same data" };

            const categoryEntity = await this._fileCategoryRepository.create({...request});
            await this._fileCategoryRepository.save(categoryEntity);
            return { code: HttpStatus.CREATED, msg: "Category was created." }
        }
        catch(error){
            this._logger.error(`ERROR CREATE: ${JSON.stringify(error)}`);
            return null;
        }
    }


    async edit(request: {id:number, name: string}){
        try {
            const duplicated = await this._fileCategoryRepository.findOne({
                where: {
                    id: Not(Equal(request.id)),
                    name: ILike(`%${request.name}%`)
                }
            });

            if(duplicated)
                return { code: HttpStatus.BAD_REQUEST, msg: "There is already a branch with same data" };

            const category = await this._fileCategoryRepository.findOneBy({
                id: request.id
            });
                
            if(!category)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
    
            category.name = request.name;
            await this._fileCategoryRepository.save(category);
            return { code: HttpStatus.CREATED, msg: "Category was updated."};
        }
        catch(error){
            this._logger.error(`EDIT: ${JSON.stringify(error)}`);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: error };
        }
    }
}