import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PropertiesData } from "./models/data/PropertiesData";
import { Repository } from "typeorm";
import { where } from 'sequelize';
import { UpdateCompanyPropertiesDto } from './models/data/dto/UpdateCompanyPropertiesDto';

@Injectable()
export class CompanyService {

    private _logger: Logger;

    constructor(
        @InjectRepository(PropertiesData)
        private _propertiesRepository: Repository<PropertiesData>
    ){
        this._logger = new Logger(CompanyService.name);
    }

    async getCompany(company: number){
        try {

            const properties = await this._propertiesRepository.findOne({
                where: {
                    id: company
                },
                select: {
                    logo: true,
                    header: true,
                    footer: true,
                    primaryColor: true,
                    secondaryColor: true,
                    primaryButtonColor: true,
                    secondaryButtonColor: true                    
                }
            })

            if(!properties)
                return { code: HttpStatus.OK, data: {} };

            return { code: HttpStatus.OK, data: properties };
        }
        catch(error){
            this._logger.error("Error getting company properties:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting company properties" };
        }
    }

    async updateProperties(request: UpdateCompanyPropertiesDto){
        try {
            const companyId = 1;
            
            const properties = await this._propertiesRepository.findOne({
                where: {
                    companyId
                }
            });

            if(!properties)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error updating company properties" };

            properties.header = request.header;
            properties.footer = request.footer;
            properties.primaryColor = request.primaryColor;
            properties.primaryButtonColor = request.primaryButtonColor;
            properties.secondaryColor = request.secondaryColor;
            properties.secondaryButtonColor = request.secondaryButtonColor;
            properties.logo = request.logo;

            this._propertiesRepository.save(properties);

            return { code: HttpStatus.OK, msg: "Company properties updated" };
        }
        catch(error){
            this._logger.error("Error updating company properties:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error updating company properties" };
        }
    }
}