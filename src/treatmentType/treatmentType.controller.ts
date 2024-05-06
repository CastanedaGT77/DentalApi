import { Body, Controller, Delete, Get, HttpStatus, Post, Put } from "@nestjs/common";
import { CreateTreatmentTypeDto } from "./models/requests/CreateTreatmentTypeDto";
import { TreatmentTypeService } from "./treatmentType.service";
import { EditTreatmentTypeDto } from "./models/requests/EditTreatmentTypeDto";
import { DeleteTreatmentTypeDto } from "./models/requests/DeleteTreatmentTypeDto";

@Controller('treatmentType')
export class TreatmentTypeController {
    
    constructor(
        private readonly _treatmentTypeService: TreatmentTypeService
    ){}

    @Get()
    async getAll(){
        const treatments = await this._treatmentTypeService.getAll();
        if(!treatments){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los tratamientos."}
        }
        return treatments;
    }

    @Post()
    async createTreatmentType(@Body() request: CreateTreatmentTypeDto){
        const response = await this._treatmentTypeService.create(request);

        if(!response){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido ingresar el tratamiento."};
        }
        else if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.BAD_REQUEST, message: "Error. Ya existe un registro con el nombre ingresado."};
        }

        return {code: HttpStatus.CREATED, message: "El tratamiento se ha creado correctamente."};
    }

    @Put()
    async editIllnessDetail(@Body() request: EditTreatmentTypeDto){
        const response = await this._treatmentTypeService.edit(request);

        if(!response){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido actualizar el tratamiento."};
        }
        else if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.BAD_REQUEST, message: "Error. Ya existe un registro con el nombre ingresado."};
        }

        return {code: HttpStatus.CREATED, message: "El tratamiento se ha editado correctamente."};
    }

    @Delete()
    async deleteIllnessDetails(@Body() request: DeleteTreatmentTypeDto){
        const response = await this._treatmentTypeService.delete(request);

        if(!response){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido eliminar el tratamiento."};
        }
        if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. El elemento proporcionado es incorrecto."};
        }

        return {code: HttpStatus.CREATED, message: "El tratamiento se ha eliminado correctamente."};
    }
}