import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchData } from './models/data/BranchData';
import { Equal, ILike, Not, Repository } from 'typeorm';
import { CreateBranchDto } from './models/requests/CreateBranchDto';
import { EditBranchDto } from './models/requests/EditBranchDto';

@Injectable()
export class BranchService {

    private _logger: Logger;

    constructor(
        @InjectRepository(BranchData)
        private readonly _branchRepository: Repository<BranchData>
    ){
        this._logger = new Logger(BranchService.name);
    }

    // Get All
    async getAll() : Promise<BranchData[]> {
        try {
            const branchs = await this._branchRepository.find();
            return branchs;
        }
        catch(error){
            console.log("ERROR BRANCH.SERVICE.GET:", error);
            return null;
        }
    }

    // Get active
    async getActive() : Promise<BranchData[]> {
        try {
            const branchs = await this._branchRepository.findBy({
                active: true
            });
            return branchs;
        }
        catch(error){
            console.log("ERROR BRANCH.SERVICE.GETALL:", error);
            return null;
        }
    }

    async create(request: CreateBranchDto){
        try {
            // Validate if name exists
            const duplicated = await this._branchRepository.findOne({
                where: {
                    name: ILike(`${request.name}`),
                    active: true
                }
            });

            if(duplicated)
                return { code: HttpStatus.BAD_REQUEST, msg: "There is already a branch with same data" };

            const branchEntity = this._branchRepository.create({...request, active: true});
            await this._branchRepository.save(branchEntity);
            return { code: HttpStatus.CREATED, msg: "Branch was created." }
        }
        catch(error){
            this._logger.error(`CREATE: ${JSON.stringify(error)}`);
            return null;
        }
    }

    async edit(request: EditBranchDto){
        try {
            const duplicated = await this._branchRepository.findOne({
                where: {
                    id: Not(Equal(request.id)),
                    name: ILike(`%${request.name}%`)
                }
            });

            if(duplicated)
                return { code: HttpStatus.BAD_REQUEST, msg: "There is already a branch with same data" };

            const branch = await this._branchRepository.findOneBy({
                id: request.id
            });
                
            if(!branch)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
    
            branch.name = request.name;
            branch.updated_at = new Date();
            await this._branchRepository.save(branch);
            return { code: HttpStatus.OK, msg: "Branch was updated."};
        }
        catch(error){
            this._logger.error(`EDIT: ${JSON.stringify(error)}`);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: error };
        }
    }

    async delete(branchId: number){
        try {
            const branch = await this._branchRepository.findOneBy({
                id: branchId
            });
            
            if(!branch)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            branch.active = false;
            branch.updated_at = new Date();
            await this._branchRepository.save(branch);
            return { code: HttpStatus.OK, msg: "Branch was deleted."};
        }
        catch(error){
            this._logger.error(`DELETE: ${JSON.stringify(error)}`);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: error };
        }
    }
}