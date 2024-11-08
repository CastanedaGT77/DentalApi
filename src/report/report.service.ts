import { Injectable, Logger } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { PrinterService } from './printer/printer.service';
import { firstReport } from './data/firstReport';
import { tableReport } from './data/tableReport';
import { patientData } from './data/patientData';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientData } from 'src/patient/models/data/PatientData';
import { Repository } from 'typeorm';
import { TreatmentData } from 'src/treatment/models/data/TreatmentData';
import { paymentReceiptDoc } from './data/paymentReceipt';
import { AppointmentData } from 'src/appointment/models/data/AppointmentData';
import { fullPatientReportData } from './data/fullPatientReportData';

@Injectable()
export class ReportService {

    constructor(
        @InjectRepository(PatientData) private _patientRepository: Repository<PatientData>,
        @InjectRepository(TreatmentData) private _treatmentRepository: Repository<TreatmentData>,
        @InjectRepository(AppointmentData) private _appointmentRepo: Repository<AppointmentData>,
        private readonly _printerService: PrinterService
    ){}

    // PATIENT DATA
    async fullPatientReport(patientId: number){
        try {
            // patient
            const patient = await this._patientRepository.findOneByOrFail({
                id: patientId
            });

            const appointments = await this._appointmentRepo.findBy({
                patientId: {
                    id: patient.id
                }
            });

            const report = {
                patient,
                appointments
            };

            console.log(report);
            const document = fullPatientReportData(report);
            return this._printerService.createPdf(document);
        }
        catch(error){

        }
    }

    async patientData(patientId: number){

        // Patient data
        const patient = await this._patientRepository.findOneBy({
            id: patientId
        });

        // Treatments
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

        const document = patientData(patient, treatments);

        return this._printerService.createPdf(document);
    }

    // Payments
    paymentReceipt(data: any){
        const document = paymentReceiptDoc(data);
        return this._printerService.createPdf(document);
    }
}