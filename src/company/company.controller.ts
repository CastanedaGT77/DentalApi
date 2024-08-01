import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { UpdateCompanyPropertiesDto } from "./models/dto/UpdateCompanyPropertiesDto";

@Controller('company')
export class CompanyController {

    constructor(
        private readonly _companyService: CompanyService
    ){}

    @Get('properties/:id')
    async getCompanyProperties(@Param('id') id: number){
        return await this._companyService.getCompany(id);
    }

    @Put('properties')
    async updateCompanyProperties(@Body() request: UpdateCompanyPropertiesDto){
        return await this._companyService.updateProperties(request);
    }
}