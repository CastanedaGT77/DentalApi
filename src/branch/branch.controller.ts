import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BranchService } from "./branch.service";
import { CreateBranchDto } from "./models/requests/CreateBranchDto";
import { EditBranchDto } from "./models/requests/EditBranchDto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('branch')
@UseGuards(AuthGuard)
export class BranchController {

    constructor(
        private readonly _branchService: BranchService
    ){}

    @Get()
    async getAll(){
        const response = await this._branchService.getAll();
        return response;
    }

    @Post()
    async create(@Body() request: CreateBranchDto){
        return await this._branchService.create(request);
    }

    @Put()
    async update(@Body() request: EditBranchDto){
        return await this._branchService.edit(request);
    }

    @Delete(':id')
    async delete(@Param('id') id: number){
        return await this._branchService.delete(id);
    }
}