import { Body, Controller, Post } from "@nestjs/common";
import { BranchService } from "./branch.service";
import { CreateBranchDto } from "./models/requests/CreateBranchDto";

@Controller('branch')
export class BranchController {

    constructor(
        private readonly _branchService: BranchService
    ){}

    @Post()
    async create(@Body() request: CreateBranchDto){
        const response = await this._branchService.create(request);
        return true;
    }
}