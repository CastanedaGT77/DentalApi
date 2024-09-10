import { Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('files')
export class FilesController {

    constructor(){

    }

    @Get()
    async test(){
        console.log("SI");
        return {response: "SI"};
    }

    @Post('test')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File){
        console.log("FILE:", file);
    }

}