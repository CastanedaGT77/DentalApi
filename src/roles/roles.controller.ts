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

    @Get('permissions')
    async getPermissions(){
        const permissions = await this._rolesService.getPermissions();
        if(!permissions)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los permisos."};   
        return permissions;
    }

    @Post()
    async create(@Body() request: CreateRoleDto){
        const response = await this._rolesService.createRole(request);
        if(!response)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido crear el rol."};
        if(response === HttpStatus.BAD_REQUEST)
            return {code: HttpStatus.CREATED, message: "Error. Ya existe un rol con el nombre proporcionado."};
        return {code: HttpStatus.CREATED, message: "Rol creado correctamente."};
    }

    @Put()
    async edit(@Body() request: EditRoleDto){
        const response = await this._rolesService.editRole(request);
        if(!response)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido editar el rol."};
        if(response === HttpStatus.BAD_REQUEST)
            return {code: HttpStatus.CREATED, message: "Error. Ya existe un rol con el nombre proporcionado."};
        return {code: HttpStatus.CREATED, message: "Rol editado correctamente."};
    }

    @Delete()
    async delete(@Body() request: DeleteRoleDto){
        const response = await this._rolesService.deleteRole(request);
        if(!response){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido eliminar el rol."}
        }
        return {code: HttpStatus.OK, message: "Rol eliminado correctamente."};
    }
}