import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import hashPassword from 'src/helpers/password/hashPassword';
import generateUserName from 'src/helpers/password/generateUserName';
import { PatientData } from './models/data/PatientData';
import { CreatePatientDto } from './models/requests/CreatePatientDto';
import { DeletePatientDto } from './models/requests/DeletePatientDto';
import { GetPatientDto } from './models/requests/GetPatientDto';
import { GetProfileImageDto } from './models/requests/GetProfileImageDto';
import { SetProfileImageDto } from './models/requests/SetProfileImageDto';
import { UpdatePatientDto } from './models/requests/UpdatePatientDto';
import { IllnessDetailsData } from 'src/illnessDetail/models/data/IllnessDetailData';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PatientService {

    private _logger: Logger;

    constructor(
        @InjectRepository(PatientData)
        private _patientRepository: Repository<PatientData>,
        @InjectRepository(IllnessDetailsData)
        private _illnessDetailRepository: Repository<IllnessDetailsData>,
        private readonly _emailService: EmailService
    ){
        this._logger = new Logger(PatientService.name);
    }

    // Get all patients
    async getAllPatients() {
        try {
            const patients: PatientData[] = await this._patientRepository.find({relations: ['illnessDetails']});
            patients.forEach(p => {
                delete p.profileImage
            });
            return { code: HttpStatus.OK, data: patients };
        } catch(error) {
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) }
        }
    }

    async getActivePatients() {
        try {
            const patients: PatientData[] = await this._patientRepository.find(
                {
                    where: {
                        active: true
                    },
                    relations: ['illnessDetails']
                }
            );
            patients.forEach(p => {
                delete p.profileImage
            });
            return { code: HttpStatus.OK, data: patients };
        } catch(error) {
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) }
        }
    }

    async getInactivePatients() {
        try {
            const patients: PatientData[] = await this._patientRepository.find(
                {
                    where: {
                        active: false
                    },
                    relations: ['illnessDetails']
                }
            );
            patients.forEach(p => {
                delete p.profileImage
            });
            return { code: HttpStatus.OK, data: patients };
        } catch(error) {
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) }
        }
    }

    // Get active patients
    async getApprovedPatients() : Promise<PatientData[]> {
        try {
            const patients: PatientData[] = await this._patientRepository.find({
                relations: ['illnessDetails'],
                where: {
                    approved: true,
                    active: true
                }
            });
            patients.forEach(p => {
                delete p.profileImage
            });
            return patients;
        } catch {
            return null; 
        }
    }

    async getUnApprovedPatients() : Promise<PatientData[]> {
        try {
            const patients: PatientData[] = await this._patientRepository.find({
                relations: ['illnessDetails'],
                where: {
                    approved: false
                }
            });
            patients.forEach(p => {
                delete p.profileImage
            });
            return patients;
        } catch {
            return null;
        }
    }

    async getDisabledPatients() : Promise<PatientData[]> {
        try {
            const patients: PatientData[] = await this._patientRepository.find({
                relations: ['illnessDetails'],
                where: {
                    approved: true,
                    active: false
                }
            });
            patients.forEach(p => {
                delete p.profileImage
            });
            return patients;
        } catch {
            return null;
        }
    }

    async getPatientInfo(request: GetPatientDto) {
        try {
            const patient: PatientData = await this._patientRepository.findOneBy({
                id: request.id
            });
            if(!patient){
                return HttpStatus.BAD_REQUEST;
            }
            return patient;
        } catch(error){
            return null;
        }
    }

    async getProfileImage(patientId: number){
        try {
            const patient: PatientData = await this._patientRepository.findOneBy({
                id: patientId
            });
            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
            
            return { code: HttpStatus.OK, data: patient.profileImage };
        } catch(error){
            return null;
        }
    }

    async setProfileImage(request: SetProfileImageDto){
        try {
            const patient = await this._patientRepository.findOneBy({
                id: request.id
            });
            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            patient.profileImage = request.image;
            await this._patientRepository.save(patient);
            return { code: HttpStatus.OK, msg: "Profile image updated" };
        } catch(error){
            this._logger.error("SET PROFILE IMAGE: ", JSON.stringify(error));
            return null;
        }
    }

    // Post
    async createPatient(patient: CreatePatientDto) {
        try {
            let details: IllnessDetailsData[] = [];
            const createdPatient = await this._patientRepository.create({...patient, illnessDetails: []});
            for(let i=0; i<patient.illnessDetails.length; i++){
                const temp = await this._illnessDetailRepository.findOneBy({
                    id: patient.illnessDetails[i]
                });
                if(temp){
                    details.push(temp);
                }
            }
            createdPatient.active = true;
            createdPatient.approved = true;
            createdPatient.profileImage = "";
            createdPatient.illnessDetails = details;
            const saved = await this._patientRepository.save(createdPatient);
            return {code: HttpStatus.CREATED, msg: 'Patient created', data: saved.id}
        } catch(error){
            this._logger.error("CREATE:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
        }
    }

    // Put
    async updatePatient(patient: UpdatePatientDto) {
        try {
            let foundPatient = await this._patientRepository.findOneBy({
                id: patient.id
            });

            if(foundPatient){
                // Fill data
                foundPatient.address = patient.address;
                foundPatient.birthDate = patient.birthDate;
                foundPatient.cellPhoneNumber = patient.cellPhoneNumber;
                foundPatient.city = patient.city;
                foundPatient.email = patient.email;
                foundPatient.firstName = patient.firstName;
                foundPatient.lastName = patient.lastName;
                foundPatient.maritalStatus = patient.maritalStatus;
                foundPatient.occupation = patient.occupation;
                foundPatient.personInCharge = patient.personInCharge;
                foundPatient.personalDoctor = patient.personalDoctor;
                foundPatient.phoneNumber = patient.phoneNumber;
                foundPatient.previousDentist = patient.previousDentist;
                foundPatient.recommendedBy = patient.recommendedBy;
                let details: IllnessDetailsData[] = [];
                for(let i=0; i<patient.illnessDetails.length; i++){
                    const temp = await this._illnessDetailRepository.findOneBy({
                        id: patient.illnessDetails[i]
                    });
                    if(temp){
                        details.push(temp);
                    }
                }
                foundPatient.illnessDetails = details;
                await this._patientRepository.save(foundPatient);
            }
            return { code: HttpStatus.CREATED, msg: "Patient updated" };
        } catch(error){
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) }
        }
    }

    // Delete
    async deletePatient(patientId: DeletePatientDto) {
        try {
            const patient = await this._patientRepository.findOneBy({
                id: patientId.id
            });
            if(!patient)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
            patient.active = false;
            await this._patientRepository.save(patient);
            return {code: HttpStatus.OK, msg: "Patient deleted"};
        } catch(error){
            this._logger.error("DELETE:", JSON.stringify(error));
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error)};
        }
    }
}