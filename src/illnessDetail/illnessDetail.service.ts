import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IllnessDetailsData } from "./models/data/IllnessDetailData";
import { Equal, ILike, Not, Repository } from "typeorm";
import { CreateIllnessDetailDto } from "./models/requests/CreateIllnessDetailDto";
import { DeleteIllnessDetailDto } from "./models/requests/DeleteIllnessDetailDto";
import { EditIllnessDetailDto } from "./models/requests/EditIllnessDetailDto";

@Injectable()
export class IllnessDetailService {

    constructor(
        @InjectRepository(IllnessDetailsData)
        private _illnessDetailRepository: Repository<IllnessDetailsData>
    ){
    }

    async getAll() : Promise<IllnessDetailsData[]> {
        try {
            const illnessDetails = await this._illnessDetailRepository.find();
            return illnessDetails;
        }
        catch(error){
            console.log("ERROR getAll:", error);
            return null;
        }
    }

    async getActive() : Promise<IllnessDetailsData[]>{
        try {
            const illnessDetails = await this._illnessDetailRepository.find({
                where: {
                    active: true
                }
            });
            return illnessDetails;
        }
        catch(error){
            return null;
        }
    }

    async create(request: CreateIllnessDetailDto){
        try {
            // Validate if name exists
            const duplicated = await this._illnessDetailRepository.findOne({
                where: {
                    name: ILike(`${request.name}`)
                }
            });

            if(duplicated){
                return HttpStatus.BAD_REQUEST;
            }

            const createdDetail = await this._illnessDetailRepository.create(request);
            createdDetail.active = true;
            const saved = await this._illnessDetailRepository.save(createdDetail);
            return true;
        } catch(error){
            return null;
        }
    }

    async edit(request: EditIllnessDetailDto){
        try {
            // Validate if name exists
            const duplicated = await this._illnessDetailRepository.findOne({
                where: {
                    id: Not(Equal(request.id)),
                    name: ILike(`%${request.name}%`)
                }
            });

            if(duplicated){
                return HttpStatus.BAD_REQUEST;
            }

            const detail = await this._illnessDetailRepository.findOne({
                where: {
                    id: request.id
                }
            });
            detail.name = request.name;
            detail.description = request.description;

            const updated = await this._illnessDetailRepository.save(detail);
            return true;
        } catch(error){
            return null;
        }
    }

    async delete(request: DeleteIllnessDetailDto){
        try {
            const detail = await this._illnessDetailRepository.findOneBy({
                id: request.id
            });

            if(!detail){
                return HttpStatus.BAD_REQUEST;
            }

            detail.active = false;
            await this._illnessDetailRepository.save(detail);
            return true;

        } catch(error){
            return null;
        }
    }
}