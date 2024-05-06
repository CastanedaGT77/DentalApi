import { Body, Controller, Delete, Get, HttpStatus, Post, Put } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IllnessDetailsData } from "./models/data/IllnessDetailData";
import { IllnessDetailService } from "./illnessDetail.service";
import { CreateIllnessDetailDto } from "./models/requests/CreateIllnessDetailDto";
import { DeleteIllnessDetailDto } from "./models/requests/DeleteIllnessDetailDto";
import { of } from "rxjs";
import { EditIllnessDetailDto } from "./models/requests/EditIllnessDetailDto";

@Controller('illnessDetail')
export class IllnessDetailController {

    constructor(
        private readonly _illnessDetailService: IllnessDetailService
    ){

    }

    @Get('all')
    async getAll(){
        const details = await this._illnessDetailService.getAll();
        if(!details)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los detalles de enfermedad."}
        return details;
    }

    @Get()
    async getActiveIllnessDetails(){
        const details = await this._illnessDetailService.getActive();
        if(!details)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los detalles de enfermedad."}
        return details;
    }

    @Post()
    async createIllnessDetail(@Body() request: CreateIllnessDetailDto){
        const response = await this._illnessDetailService.create(request);

        if(!response){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido ingresar el detalle."};
        }
        else if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.BAD_REQUEST, message: "Error. Ya existe un registro con el nombre ingresado."};
        }

        return {code: HttpStatus.CREATED, message: "El detalle se ha creado correctamente."};
    }

    @Put()
    async editIllnessDetail(@Body() request: EditIllnessDetailDto){
        const response = await this._illnessDetailService.edit(request);

        if(!response){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido ingresar el detalle."};
        }
        else if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.BAD_REQUEST, message: "Error. Ya existe un registro con el nombre ingresado."};
        }

        return {code: HttpStatus.CREATED, message: "El detalle se ha editado correctamente."};
    }

    @Delete()
    async deleteIllnessDetails(@Body() request: DeleteIllnessDetailDto){
        const response = await this._illnessDetailService.delete(request);

        if(!response){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido eliminar el detalle."};
        }
        if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. El elemento proporcionado es incorrecto."};
        }

        return {code: HttpStatus.CREATED, message: "El detalle se ha eliminado correctamente."};
    }
}