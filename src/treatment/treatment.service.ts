import { HttpStatus, Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateTreatmentDto } from './models/requests/CreateTreatmentDto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreatmentData } from './models/data/TreatmentData';
import { Repository } from 'typeorm';
import { TreatmentTypeData } from 'src/treatmentType/models/data/TreatmentTypeData';
import { TreatmentDetailsData } from './models/data/TreatmentDetailsData';
import { PatientData } from 'src/patient/models/data/PatientData';
import { UpdateTreatmentDto } from './models/requests/UpdateTreatmentDto';
import { UpdateTreatmentDetailDto } from './models/requests/UpdateTreatmentDetailDto';
import { AddTreatmentDetailDto } from './models/requests/AddTreatmentDetailDto';

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

    /*
        OBTIENE TODOS LOS ENCABEZADOS DE TODOS LOS PACIENTES DE TODOS LOS ESTADOS
    */
    async getAll(){
        try {
            const treatments = await this._treatmentRepository.find({
                relations: ['patient'],
                select: {
                    patient: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                order: {
                    id: "DESC"
                }
            });
            return { code: HttpStatus.OK, data: treatments };
        }
        catch(error){
            this._logger.error("GET ALL TREATMENTS:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting treatments" };
        }
    }

    /* 
    
    */
    async getTreatmentSummary(id: number){
        try {
            const treatment = await this._treatmentRepository.find({
                where: {
                    id: id,
                },
                relations: ['treatmentDetails', 'treatmentDetails.treatmentType', 'treatmentDetails.payments']
            })
            return { code: HttpStatus.OK, data: treatment };
        }
        catch(error){
            this._logger.error("GET TREATMENT SUMMARY:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting treatment summary" };
        }
    }


   /*
        OBTIENE LOS ENCABEZADOS DE TRATAMIENTOS PENDIENTES POR PACIENTE ID
   */
   async getPendingTreatmentHeaderByPatient(patientId: number){
       try {
           const pendingTreatments = await this._treatmentRepository.findBy({
                status: false,
                patient: {
                    id: patientId
                }
           });

           return { code: HttpStatus.OK, data: pendingTreatments };
       }
       catch(error){
           this._logger.error("Error.GetPendingTreatmentHeaderByPatient:", error);
           return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting pending treatments" };
       }
   }

   /*
    OBTIENE TODOS LOS TRATAMIENTOS DE UN PACIENTE Y LOS DETALLES DE LOS TRATAMIENTOS
   */
    async getByPatient(patientId: number){
        try {
            const patient = await this._patientRepository.findOneBy({
                id: patientId
            });

            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            const treatments = await this._treatmentRepository.find({
                where: {
                    patient: {
                        id: patientId
                    }
                },
                relations: ['treatmentDetails', 'treatmentDetails.treatmentType'],
                order: {
                    id: "DESC"
                }
            });

            return { code: HttpStatus.OK, data: treatments };
        }
        catch(error){
            this._logger.error("GET BY PATIENT:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting treatments"};
        }
    }


    /*
        CREACION DE TRATAMIENTO
    */
    async createTreatment(request: CreateTreatmentDto){
        try {
            // Create treatment
            const patient = await this._patientRepository.findOneBy({
                id: request.patientId
            });

            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            const treatment: Partial<TreatmentData> = {...request, patient, status: false, paymentStatus: false};
            const createdTreatment = await this._treatmentRepository.save(treatment);

            // Create treatment details
            for(let i=0; i < request.treatmentTypes.length; i++){
                const treatmentType = await this._treatmentTypeRepository.findOneBy({
                    id: request.treatmentTypes[i].treatmentTypeId
                });
                if(treatmentType){
                    const treatmentDetail: Partial<TreatmentDetailsData> = {
                        treatment: createdTreatment,
                        treatmentType: treatmentType,
                        suggestedPrice: treatmentType.suggestedPrice,
                        realPrice: request.treatmentTypes[i].price,
                        paymentStatus: false,
                        piece: request.treatmentTypes[i].piece,
                        status: false
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

    /*
        ACTUALIZACION DE ENCABEZADO DE TRATAMIENTO
    */
    async updateTreatment(request: UpdateTreatmentDto){
        try {
            const treatment = await this._treatmentRepository.findOneBy({
                id: request.id
            });

            if(!treatment)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            treatment.description = request.description;
            treatment.name = request.name;
            treatment.quotation = request.quotation;
            await this._treatmentRepository.save(treatment);

            return { code: HttpStatus.OK, msg: "Treatment updated." };
        }
        catch(error){
            this._logger.error("UPDATE TREATMENT:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error updating treatment" };
        }
    }


    /*
        AGREGAR DETALLE A UN TRATAMIENTO
    */
    async addTreatmentDetail(request: AddTreatmentDetailDto){
        try {
            const treatment = await this._treatmentRepository.findOneBy({
                id: request.treatmentId
            });

            const treatmentType = await this._treatmentTypeRepository.findOneBy({
                id: request.treatmentTypeId
            });

            if(!treatmentType || !treatment)
                return { code: HttpStatus.OK, msg: "Invalid parameters" }

            const treatmentDetail = await this._treatmentDetailRepository.create(
                {
                    ...request,
                    treatment,
                    treatmentType,
                    suggestedPrice: treatmentType.suggestedPrice,
                    paymentStatus: false,
                    status: false,
                    realPrice: request.price
                }
            );

            await this._treatmentDetailRepository.save(treatmentDetail);

            return { code: HttpStatus.CREATED, msg: "Treatment detail added." };

        }
        catch(error){
            this._logger.error("Erro.Add treatment detailL", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Treatment detaild could not be added." };
        }
    }

    /*
        ACTUALIZACION DE DETALLE DE TRATAMIENTO
    */
    async updateTreatmentDetail(request: UpdateTreatmentDetailDto){
        try {
            const treatmentDetail = await this._treatmentDetailRepository.findOneBy({
                id: request.id
            });

            if(!treatmentDetail)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters." };
            
            if(treatmentDetail.status === true)
                return { code: HttpStatus.BAD_REQUEST, msg: "Finished treatment detail can not be updated." }


            const treatmentType = await this._treatmentTypeRepository.findOneBy({
                id: request.treatmentTypeId
            })

            if(!treatmentType)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
            

            treatmentDetail.realPrice = request.price;
            treatmentDetail.piece = request.piece;
            treatmentDetail.treatmentType = treatmentType;

            await this._treatmentDetailRepository.save(treatmentDetail);
            return { code: HttpStatus.OK, msg: "Treatment detail updated" };
        }
        catch(error){
            this._logger.error("Error.Update treatment detail:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Treatment detail could not be updated" };
        }
    }

    /*
        ELIMINAR DETALLE DE TRATAMIENTO
    */
    async deleteTreatmentDetail(detailId: number){
        try {
            const detail = await this._treatmentDetailRepository.findOneBy({
                id: detailId
            });

            if(!detail)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
            
            if(detail.status === true)
                return { code: HttpStatus.BAD_REQUEST, msg: "Finished treatment can not be deleted." };
            
            const deleted = await this._treatmentDetailRepository.delete({
                id: detailId
            });

            return { code: HttpStatus.OK, msg: "Treatment detail was deleted." };
        }
        catch(error){
            this._logger.error("DELETE TREATMENT DETAIL:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Treatment detail could not be deleted." };
        }
    }
}