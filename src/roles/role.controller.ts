import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RolesService } from "./role.service";
import { CreateRoleDto } from "./models/requests/CreateRoleDto";
import { GetRoleDto } from "./models/requests/GetRoleDto";
import { DeleteRoleDto } from "./models/requests/DeleteRoleDto";
import { EditRoleDto } from "./models/requests/EditRoleDto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('roles')
//@UseGuards(AuthGuard)
export class RolesController {

    constructor(
        private readonly _rolesService: RolesService
    ){}

    @Get()
    async getAll(){
        return await this._rolesService.getAll();
    }

    @Get("permission")
    async yes(){
        return await this._rolesService.getPermissions();
    }

    @Get('/:id')
    async getById(@Param('id') id: number){
        return await this._rolesService.getRole(id);
    }

    @Get('permissions')
    async getPermissions(){
        return await this._rolesService.getPermissions();
    }

    @Post()
    async create(@Body() request: CreateRoleDto){
        return await this._rolesService.createRole(request)
    }

    @Put()
    async edit(@Body() request: EditRoleDto){
        return await this._rolesService.editRole(request);
    }

    @Delete()
    async delete(@Body() request: DeleteRoleDto){
        return await this._rolesService.deleteRole(request);
    }
}