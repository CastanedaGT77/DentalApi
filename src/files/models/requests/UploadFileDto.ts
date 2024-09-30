import { IsNotEmpty, IsNumber } from "class-validator";

export class UploadFileDto {
    
    @IsNotEmpty()
    patientId: number;

    @IsNotEmpty()
    fileCategoryId: number;
}