import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { NewsService } from "./news.service";
import { CreateNewDto } from './models/requests/CreateNewDto';
import { UpdateNewDto } from "./models/requests/UpdateNewDto";

@Controller('news')
export class NewsController {

    constructor(
        private readonly _newsService: NewsService
    ){}

    @Get('all')
    async getAll(){
        const response = await this._newsService.getAllNews();
        return {code: HttpStatus.OK, data: response}
    }

    @Get('available')
    async getAvailable(){
        const response = await this._newsService.getAvailableNews();
        return {code: HttpStatus.OK, data: response}
    }

    @Post()
    async createNew(@Body() request: CreateNewDto){
        const response = await this._newsService.createNew(request);
        if(response){
            return { code: HttpStatus.CREATED, msg: "New was created." };
        }
        return { code: HttpStatus.BAD_REQUEST, msg: "New was not created." };
    }

    @Put()
    async updateNew(@Body() request: UpdateNewDto){
        const response = await this._newsService.createNew(request);
        if(response){
            return { code: HttpStatus.OK, msg: "New was updated." };
        }
        return { code: HttpStatus.BAD_REQUEST, msg: "New was not updated." };
    }

    @Delete(':id')
    async delete(@Param('id') id: number){
        const response = await this._newsService.deleteNew(id);

        if(response){
            return { code: HttpStatus.CREATED, msg: "New was deleted." };
        }
        return { code: HttpStatus.BAD_REQUEST, msg: "New was not deleted." };
    }
}