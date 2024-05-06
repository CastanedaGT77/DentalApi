import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { CreateTreatmentDto } from './models/requests/CreateTreatmentDto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentData } from './models/data/TreatmentData';
import { Repository } from 'typeorm';
import { TreatmentTypeData } from 'src/treatmentType/models/data/TreatmentTypeData';
import { TreatmentDetailsData } from './models/data/TreatmentDetailsData';
import { PatientData } from 'src/patient/models/data/PatientData';

@Injectable()
export class TreatmentService {

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
    }

    async createTreatment(request: CreateTreatmentDto){
        try {
            // Create treatment
            const patient = await this._patientRepository.findOneBy({
                id: request.patientId
            });

            if(!patient)
                return HttpStatus.BAD_REQUEST;

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
            return true;
        }
        catch(error){
            console.log("CREATE TREATMENT:::",error);
            return null;
        }
    }
}