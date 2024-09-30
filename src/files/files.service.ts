import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileData } from "./models/data/FileData";
import { Repository } from "typeorm";
import * as fs from 'fs-extra';

@Injectable()
export class FileService {

    _logger: Logger;

    constructor(
        @InjectRepository(FileData) private _fileRepository: Repository<FileData>
    ){
        this._logger = new Logger(FileService.name);
    }


    async getAllFiles(){
        try {
            const files = await this._fileRepository.find();
            return files;
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

    async saveFile(record: Partial<FileData>){
        try {
            const insertedFile = await this._fileRepository.save({...record, uploadedBy: 1});
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