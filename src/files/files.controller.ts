import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { UploadFileDto } from "./models/requests/UploadFileDto";
import { FileService } from "./files.service";
import { existsSync } from "fs";
import { Response } from 'express';
import { AuthGuard } from "src/auth/auth.guard";

@Controller('files')
//@UseGuards(AuthGuard)
export class FilesController {

    constructor(
      private readonly _fileService: FileService
    ){
    }

    @Get()
    async getFiles(){
      return await this._fileService.getAllFiles();
    }

    @Get('patient/:id')
    async getPatientFiles(@Param('id') id: number){
      return await this._fileService.getPatientFiles(id);
    }


    @Post()
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads', // Puedes cambiar la ruta de destino
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // Limitar a 10 MB
        fileFilter: (req, file, cb) => {
          if (file.originalname.match(/\/(jpeg|png|pdf)$/)) {
            return cb(new BadRequestException('Solo se permiten archivos jpeg, png o pdf'), false);
          }
          cb(null, true);
        },
      }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: UploadFileDto) {
      if (!file) {
        throw new BadRequestException('El archivo es obligatorio');
      }

      if(isNaN(body.fileCategoryId) || isNaN(body.patientId)){
        throw new BadRequestException('Invalid parameters');
      }

      return await this._fileService.saveFile({...body, fileCode: file.filename, fileName: file.originalname});
    }


    @Get(':filename')
    async getFile(@Param('filename') filename: string, @Res() res: Response){
        // Definir la ruta del archivo
        const filePath = join(__dirname, '..', 'uploads', filename);

        // Verificar si el archivo existe
        if (!existsSync(filePath)) {
          throw new BadRequestException('El archivo no existe');
        }
        // Enviar el archivo como respuesta
        return res.sendFile(filePath);
    }
}