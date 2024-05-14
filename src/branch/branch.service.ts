import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchData } from './models/data/BranchData';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './models/requests/CreateBranchDto';

@Injectable()
export class BranchService {

    constructor(
        @InjectRepository(BranchData)
        private readonly _branchRepository: Repository<BranchData>
    ){
    }

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

        }
        catch(error){
            console.log("ERROR BRANCH.SERVICE.CREATE:", error);
            return null;
        }
    }

    async edit(){
        try {

        }
        catch(error){
            console.log("ERROR BRANCH.SERVICE.EDIT:", error);
            return null;
        }
    }

    async delete(){
        try {

        }
        catch(error){
            console.log("ERROR BRANCH.SERVICE.DELETE:", error);
            return null;
        }
    }
}