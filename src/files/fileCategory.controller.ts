import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { UploadFileDto } from "./models/requests/UploadFileDto";
import { FileService } from "./files.service";
import { existsSync } from "fs";
import { Response } from 'express';
import { AuthGuard } from "src/auth/auth.guard";
import { FileCategoryService } from "./filesCategory.service";
import { CreateFileCategoryDto } from "./models/requests/CreateFileCategoryDto";

@Controller('fileCategory')
//@UseGuards(AuthGuard)
export class FilesCategoryController {

    constructor(
      private readonly _fileCategoryService: FileCategoryService
    ){}

    @Get()
    async getCategories(){
      return await this._fileCategoryService.getAll();
    }

    @Post()
    async createCategory(
        @Body() request: CreateFileCategoryDto
    ){
      return await this._fileCategoryService.create(request);
    }

    @Put()
    async updateCategory(
        @Body() request: {id: number, name: string}
    ){
      return await this._fileCategoryService.edit(request);
    }
}