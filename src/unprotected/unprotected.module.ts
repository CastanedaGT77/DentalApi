import { Module } from "@nestjs/common";
import { PublicAppointmentsController } from "./public-appointmenets/public-appointments.controller";
import { NewsService } from "src/news/news.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewData } from "src/news/models/data/NewsData";
import { BranchData } from "src/branch/models/data/BranchData";
import { BranchService } from "src/branch/branch.service";
import { CompanyData } from "src/company/models/data/CompanyData";
import { PropertiesData } from "src/company/models/data/PropertiesData";
import { CompanyService } from "src/company/company.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([NewData, BranchData, CompanyData, PropertiesData])
    ],
    controllers: [
        PublicAppointmentsController
    ],
    providers: [
        NewsService,
        BranchService,
        CompanyService
    ]
})
export class UnprotectedModule {}