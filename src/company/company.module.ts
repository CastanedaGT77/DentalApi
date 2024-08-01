import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyData } from "./models/data/CompanyData";
import { PropertiesData } from "./models/data/PropertiesData";

@Module({
    imports: [TypeOrmModule.forFeature([CompanyData, PropertiesData])],
    controllers: [CompanyController],
    providers: [CompanyService]
})
export class CompanyModule {

}