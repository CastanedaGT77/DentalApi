import { HttpStatus, Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateTreatmentDto } from './models/requests/CreateTreatmentDto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentData } from './models/data/TreatmentData';
import { Repository } from 'typeorm';
import { TreatmentTypeData } from 'src/treatmentType/models/data/TreatmentTypeData';
import { TreatmentDetailsData } from './models/data/TreatmentDetailsData';
import { PatientData } from 'src/patient/models/data/PatientData';

@Injectable()
export class TreatmentService {

    _logger: Logger;

    constructor(
        @InjectRepository(PatientData)
        private _patientRepository: Repository<PatientData>,
        @InjectRepository(TreatmentData)
        private _treatmentRepository: Repository<TreatmentData>,
        @InjectRepository(TreatmentTypeData)
        private _treatmentTypeRepository: Repository<TreatmentTypeData>,
        @InjectRepository(TreatmentDetailsData)
        private _treatmentDetailRepository: Repository<TreatmentDetailsData>,
    ){
        this._logger = new Logger(TreatmentService.name);
    }

    // Get treatments by patient
    async getByPatient(patientId: number){
        try {
            const patient = await this._patientRepository.findOneBy({
                id: patientId
            });

            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            const treatments = await this._treatmentRepository.findBy({
                patient
            });

            return { code: HttpStatus.OK, data: treatments };
        }
        catch(error){
            this._logger.error("GET BY PATIENT:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting treatments"};
        }
    }

    async createTreatment(request: CreateTreatmentDto){
        try {
            // Create treatment
            const patient = await this._patientRepository.findOneBy({
                id: request.patientId
            });

            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            const treatment: Partial<TreatmentData> = {...request, patient};
            const createdTreatment = await this._treatmentRepository.save(treatment);

            // Create treatment details
            for(let i=0; i < request.treatmentTypes.length; i++){
                const treatmentType = await this._treatmentTypeRepository.findOneBy({
                    id: request.treatmentTypes[i]
                });
                if(treatmentType){
                    const treatmentDetail: Partial<TreatmentDetailsData> = {
                        treatment: createdTreatment,
                        treatmentType: treatmentType,
                        suggestedPrice: treatmentType.suggestedPrice,
                        realPrice: treatmentType.suggestedPrice,
                        paymentStatus: false
                    };
                    await this._treatmentDetailRepository.save(treatmentDetail);
                }
            }
            return { code: HttpStatus.OK, msg: "Treatment created." };
        }
        catch(error){
            console.log("CREATE TREATMENT:::",error);
            return null;
        }
    }
}