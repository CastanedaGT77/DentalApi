import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileData } from "./models/data/FileData";
import { Repository } from "typeorm";
import * as fs from 'fs-extra';
import { PatientData } from "src/patient/models/data/PatientData";
import { UserData } from "src/user/models/data/UserData";
import { FileCategoryData } from "./models/data/FileCategoryData";

@Injectable()
export class FileService {

    _logger: Logger;

    constructor(
        @InjectRepository(FileData) private _fileRepository: Repository<FileData>,
        @InjectRepository(FileCategoryData) private _fileCategoryRepo: Repository<FileCategoryData>,
        @InjectRepository(PatientData) private _patientRepo: Repository<PatientData>,
        @InjectRepository(UserData) private _userRepo: Repository<UserData>
    ){
        this._logger = new Logger(FileService.name);
    }


    async getAllFiles(){
        try {
            const users = await this._userRepo.find({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            });
            let filesData: any[] = [];
            const files = await this._fileRepository.find({
                order: {
                    id: 'DESC'
                },
                relations: ['patient', 'category'],
                select: {
                    patient: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    },
                    category: {
                        id: true,
                        name: true
                    }
                }
            });

            files?.forEach(f => {
                const userId = f?.uploadedBy || 0;
                const test = users.find(u => u.id === userId) || {};
                filesData.push({...f, uploadedBy: test});
            });

            return filesData;
        } catch(error){
            this._logger.error(`GetAllFiles: Files could not be obtained: ${JSON.stringify(error)}`);
            return null;
        }
    }

    async getPatientFiles(patientId: number){
        try {
            const files = await this._fileRepository.findBy({
                patient: {
                    id: patientId
                }
            });
            return files;
        } catch(error){
            this._logger.error(`GetPatientFiles: ${JSON.stringify(error)}`);
            return null;
        }
    }

    async saveFile(record: Partial<FileData>, patientId: number, fileCategoryId: number, user: number){
        try {
            if(!patientId)
                throw new Error("Invalid parameter");

            const patient = await this._patientRepo.findOneBy({
                id: patientId
            });

            if(!patient){
                return {code: HttpStatus.BAD_REQUEST, msg: "Patient was not found"};
            }

            const category = await this._fileCategoryRepo.findOneBy({
                id: fileCategoryId
            });

            if(!category){
                return {code: HttpStatus.BAD_REQUEST, msg: "Category was not found"};
            };

            const insertedFile = await this._fileRepository.save({
                ...record,
                uploadedBy: user,
                patient,
                category
            });

            if(!insertedFile)
                throw new Error("File could not be created");

            return {code: HttpStatus.CREATED, msg: "File created correctly"};
        } catch(error){
            this._logger.error(`Save File: ${error.message}`);
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "File could not be created"};
        }
    }

    async delete(){
        try {
        } catch(error){
            this._logger.error(`Delete: File could not be deleted: ${JSON.stringify(error)}`);
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "File could not be created"};
        }
    }
}