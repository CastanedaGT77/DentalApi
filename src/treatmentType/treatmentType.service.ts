import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TreatmentTypeData } from './models/data/TreatmentTypeData';
import { Equal, ILike, Not, Repository } from "typeorm";
import { CreateTreatmentTypeDto } from "./models/requests/CreateTreatmentTypeDto";
import { EditTreatmentTypeDto } from "./models/requests/EditTreatmentTypeDto";
import { DeleteTreatmentTypeDto } from "./models/requests/DeleteTreatmentTypeDto";

@Injectable()
export class TreatmentTypeService {

    constructor(
        @InjectRepository(TreatmentTypeData)
        private _treatmentTypeRepository: Repository<TreatmentTypeData>
    ){
    }

    // get all
    async getAll() : Promise<TreatmentTypeData[]> {
        try {
            const treatments = await this._treatmentTypeRepository.findBy({
                active: true
            });
            return treatments;
        }
        catch(error){
            return null;
        }
    }

    // create
    async create(request: CreateTreatmentTypeDto){
        try {
            // Validate if name exists
            const duplicated = await this._treatmentTypeRepository.findOne({
                where: {
                    name: ILike(`%${request.name}%`)
                }
            });

            if(duplicated){
                return HttpStatus.BAD_REQUEST;
            }

            const createdDetail = await this._treatmentTypeRepository.create(request);
            createdDetail.active = true;
            const saved = await this._treatmentTypeRepository.save(createdDetail);
            return true;
        }
        catch(error){
            return null;
        }
    }

    async edit(request: EditTreatmentTypeDto){
        try {
            // Validate if name exists
            const duplicated = await this._treatmentTypeRepository.findOne({
                where: {
                    id: Not(Equal(request.id)),
                    name: ILike(`%${request.name}%`)
                }
            });

            if(duplicated){
                return HttpStatus.BAD_REQUEST;
            }

            const treatment = await this._treatmentTypeRepository.findOne({
                where: {
                    id: request.id
                }
            });
            treatment.name = request.name;
            treatment.description = request.description;
            treatment.suggestedPrice = request.suggestedPrice;
            treatment.estimatedTime = request.estimatedTime;

            const updated = await this._treatmentTypeRepository.save(treatment);
            return true;
        } catch(error){
            return null;
        }
    }

    async delete(request: DeleteTreatmentTypeDto){
        try {
            const detail = await this._treatmentTypeRepository.findOneBy({
                id: request.id
            });

            if(!detail){
                return HttpStatus.BAD_REQUEST;
            }

            detail.active = false;
            await this._treatmentTypeRepository.save(detail);
            return true;

        } catch(error){
            return null;
        }
    }

}