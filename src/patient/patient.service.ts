import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class PatientService {

    constructor(
        @InjectRepository(PatientData)
        private _patientRepository: Repository<PatientData>
    ){}

    // Get all patients
    async getAllPatients() : Promise<PatientData[]> {
        try {
            const patients: PatientData[] = await this._patientRepository.find();
            patients.forEach(p => {
                delete p.profileImage
            });
            return patients;
        } catch {
            return null;
        }
    }

    // Get active patients
    async getApprovedPatients() : Promise<PatientData[]> {
        try {
            const patients: PatientData[] = await this._patientRepository.find({
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
            if(!patient){
                return HttpStatus.BAD_REQUEST;
            }
            return patient.profileImage;
        } catch(error){
            return null;
        }
    }

    async setProfileImage(request: SetProfileImageDto){
        try {
            const patient = await this._patientRepository.findOneBy({
                id: request.id
            });
            if(!patient){
                return HttpStatus.BAD_REQUEST;
            }
            patient.profileImage = request.image;
            await this._patientRepository.save(patient);
            return true;
        } catch(error){
            console.log("ERROR SET PROFILE IMAGE:", error);
            return null;
        }
    }

    // Post
    async createPatient(patient: CreatePatientDto) {
        try {
            const createdPatient = await this._patientRepository.create(patient);
            createdPatient.active = true;
            createdPatient.approved = true;
            createdPatient.profileImage = "";
            const saved = await this._patientRepository.save(createdPatient);

            // Assign illness details
            for(let i=0; i<patient.illnessDetails.length; i++)
            {
            }

            return saved.id;
        } catch(error){
            console.log("ERROR CREATE PATIENT:::", error);
            return null;
        }
    }

    // Put
    async updatePatient(patient: UpdatePatientDto) {
        try {
            const foundPatient = await this._patientRepository.findOneBy({
                id: patient.id
            });

            // Fill data

            const updatedPatient = await this._patientRepository.save(foundPatient);
            // Assign illness details
            for(let i=0; i<patient.illnessDetails.length; i++)
            {
            }

            return HttpStatus.OK;
        } catch(error){
            console.log("ERROR CREATE PATIENT:::", error);
            return null;
        }
    }

    // Delete
    async deletePatient(patientId: DeletePatientDto) {
        try {
            const patient = await this._patientRepository.findOneBy({
                id: patientId.id
            });
            if(!patient){
                return HttpStatus.BAD_REQUEST;
            }
            patient.active = false;
            await this._patientRepository.save(patient);
            return true;
        } catch(error){
            return null;
        }
    }
}