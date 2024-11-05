import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { UpdateCompanyPropertiesDto } from "./models/data/dto/UpdateCompanyPropertiesDto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('company')
//@UseGuards(AuthGuard)
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