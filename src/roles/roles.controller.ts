import { Body, Controller, Delete, Get, HttpStatus, Post, Put } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./models/requests/CreateRoleDto";
import { GetRoleDto } from "./models/requests/GetRoleDto";
import { DeleteRoleDto } from "./models/requests/DeleteRoleDto";
import { EditRoleDto } from "./models/requests/EditRoleDto";

@Controller('roles')
export class RolesController {

    constructor(
        private readonly _rolesService: RolesService
    ){}

    @Get()
    async get(@Body() request: GetRoleDto){
        const response = await this._rolesService.getRole(request);
        if(!response)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener la información del rol."}
        if(response === HttpStatus.BAD_REQUEST)
            return {code: HttpStatus.BAD_REQUEST, message: "Error. No existe ningún rol con la información proporcionada."}
        return response;
    }

    @Get('all')
    async getAll(){
        return await this._rolesService.getAll();
    }

    @Get('permissions')
    async getPermissions(){
        const permissions = await this._rolesService.getPermissions();
        if(!permissions)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los permisos."};   
        return permissions;
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