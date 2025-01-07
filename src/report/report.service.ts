import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrinterService } from './printer/printer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientData } from 'src/patient/models/data/PatientData';
import { Repository } from 'typeorm';
import { TreatmentData } from 'src/treatment/models/data/TreatmentData';
import { paymentReceiptDoc } from './data/paymentReceipt';
import { AppointmentData } from 'src/appointment/models/data/AppointmentData';
import { fullPatientReportData } from './data/fullPatientReportData';
import { template } from './data/template';
import { CompanyData } from 'src/company/models/data/CompanyData';

@Injectable()
export class ReportService implements OnModuleInit {

    private _logger: Logger;
    private _companyId: number;
    private _primaryColor: string;
    private _secondaryColor: string;
    private _logo: string;
    private _header: string;
    private _footer: string;

    constructor(
        @InjectRepository(CompanyData) private _companyRepo: Repository<CompanyData>,
        @InjectRepository(PatientData) private _patientRepository: Repository<PatientData>,
        @InjectRepository(TreatmentData) private _treatmentRepository: Repository<TreatmentData>,
        @InjectRepository(AppointmentData) private _appointmentRepo: Repository<AppointmentData>,
        private readonly _printerService: PrinterService
    ){
        this._logger = new Logger(ReportService.name);
        this._companyId = 1;
        this._primaryColor = "";
        this._secondaryColor = "";
        this._logo = "";
    }

    async onModuleInit() {
        await this.clinicalRecord(1);
    }

    /* PRIVATE METHODS */
    private async getCompanyConfiguration(){
        const company = this._companyRepo.findOne({
            where: {
                id: this._companyId
            },
            relations: ['properties']
        }).then((company) => {
            this._primaryColor = company.properties.primaryColor || "";
            this._secondaryColor = company.properties.secondaryColor || "";
            this._logo = company.properties.logo || "";
            this._header = company.properties.header || "";
            this._footer = company.properties.footer || "";
        }).catch(() => {
            this._primaryColor = "";
            this._secondaryColor = "";
            this._logo = "";
            this._header = "";
            this._footer = "";
        });
    }

    // Template test
    async template(){
        const title = "Template";
        const document = template(
            this._primaryColor,
            title,
            this._footer
        );
        return this._printerService.createPdf(document);
    }

    // Clinical record
    async clinicalRecord(id: number){
        try {
            const patient = await this._patientRepository.findOne({
                where: {
                    id
                },
                relations: [
                    'type'
                ]
            })
            //console.log("DATA:::", patient);
        }
        catch(error){
            return null;
        }
    }

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

    // Payments
    paymentReceipt(data: any){
        const document = paymentReceiptDoc(data);
        return this._printerService.createPdf(document);
    }
}