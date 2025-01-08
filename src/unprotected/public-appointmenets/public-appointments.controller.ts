import { Controller, Get, HttpStatus } from "@nestjs/common";
import { BranchService } from "src/branch/branch.service";
import { CompanyService } from "src/company/company.service";
import { NewsService } from "src/news/news.service";

@Controller('public-appointments')
export class PublicAppointmentsController {

    constructor(
        private readonly _newsService: NewsService,
        private readonly _branchService: BranchService,
        private readonly _companyService: CompanyService
    ){}

    @Get('news')
    public async getCompanyNews(){
        const response = await this._newsService.getAvailableNews();
        return {code: HttpStatus.OK, data: response}
    }

    @Get('branchs')
    public async getAvailableBranchs(){
        const response = await this._branchService.getActive();
        return {code: HttpStatus.OK, data: response}
    }

    @Get('properties')
    public async getCompanyProperties(){
        const response = await this._companyService.getCompany(1);
        return {code: HttpStatus.OK, data: response}
    }

    // Get all appointments by user depending on filters
    @Get()
    public test(){
        return {code: 200, data: "Hola"};
    }
}