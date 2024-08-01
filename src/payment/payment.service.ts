import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PatientData } from "src/patient/models/data/PatientData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";
import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";
import { EntityManager, Repository } from "typeorm";
import { CreatePaymentDto } from "./models/request/CreatePaymentDto";
import { PaymentHeaderData } from "./models/data/PaymentHeaderData";
import { PaymentDetailData } from "./models/data/PaymentDetailData";

@Injectable()
export class PaymentService {

    _logger: Logger;

    constructor(
        @InjectRepository(PatientData)
        private _patientRepository: Repository<PatientData>,
        @InjectRepository(TreatmentData)
        private _treatmentHeaderRepository: Repository<TreatmentData>,
        @InjectRepository(TreatmentDetailsData)
        private _treatmentDetailRepository: Repository<TreatmentDetailsData>,
        @InjectRepository(PaymentHeaderData)
        private _paymentHeaderRepository: Repository<PaymentHeaderData>,
        @InjectRepository(PaymentDetailData)
        private _paymentDetailRepository: Repository<PaymentDetailData>,
        private readonly _entityManager: EntityManager
    ){
        this._logger = new Logger(PaymentService.name);
    }

    async getPaymentsByPatient(patientId: number){
        try {
            const payments = await this._paymentHeaderRepository.find({
                where: {
                    patient: {
                        id: patientId
                    }
                },
                relations: ['paymentDetails', 'paymentDetails.treatmentDetail', 'paymentDetails.treatmentDetail.treatmentType'],
            });
            return {code: HttpStatus.OK, data: { payments }}
        }
        catch(error){
            this._logger.error("Error getting patient payments");
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting patient payments"};
        }
    }

    async getPatientPendingPayments(patientId: number){
        try {

            const patient = await this._patientRepository.findOneBy({
                id: patientId
            });

            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters"};

            const pendingTreatments = await this._treatmentHeaderRepository.find({
                where: {
                    patient: {
                        id: patient.id
                    },
                    paymentStatus: false,
                    treatmentDetails: {
                        paymentStatus: false
                    }
                },
                relations: ['treatmentDetails']
            });

            return { code: HttpStatus.OK, data: {patient, pendingTreatments}};
        }
        catch(error){
            this._logger.error("Error getting patient pending payments:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting patient pending payments"};
        }
    }

    async createPayment(request: CreatePaymentDto){
        try {
            await this._entityManager.transaction(async (manager) => {
                // Create payment header
                const paymentHeader = await manager.save(PaymentHeaderData, {
                    name: request.name,
                    address: request.address,
                    phoneNumber: request.phoneNumber,
                    patient: {
                        id: 1
                    }
                });
                // Create details
                for(let i=0; i < request.details.length; i++){
                    const treatmentDetailId = request.details[i].patientTreatmentDetailId;
                    const amount = request.details[i].amount;

                    const treatmentDetail = await manager.findOneBy(TreatmentDetailsData, {
                        id: treatmentDetailId
                    });

                    if(!treatmentDetail || treatmentDetail?.paymentStatus === true)
                        throw new Error('Trying to pay, paid treatment detail');

                    if(treatmentDetail.patientId !== paymentHeader.patient.id)
                        throw new Error('Trying to pay, another patient treatment');

                    if((treatmentDetail.pendingAmount - amount) < 0)
                        throw new Error("Invalid amount");

                    if(treatmentDetail){
                        const payment = await manager.create(PaymentDetailData, {
                            treatmentDetail,
                            paymentHeader,
                            amount
                        });
                        await manager.save(PaymentDetailData, payment);
                    }
                    treatmentDetail.pendingAmount -= amount;
                    if(treatmentDetail.pendingAmount === 0){
                        treatmentDetail.paymentStatus = true;
                    }
                    await manager.save(TreatmentDetailsData, treatmentDetail);
                }
            });

            return {code: HttpStatus.OK, msg: "Payment was successfully"};
        }
        catch(error){
            this._logger.error("Error creating payment:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error creating payment" };
        }
    }
}