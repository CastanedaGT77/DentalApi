import { BadRequestException, Body, Controller, Get, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './models/requests/CreateUserDto';
import { UserService } from './user.service';
import { GetUserDto } from './models/requests/GetUserDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {

    constructor(
        private readonly _userService: UserService
    ){}

    @Get('all')
    async getAll(){
        const response = await this._userService.getAll();
        if(!response)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los usuarios."}
        return response;
    }

    @Get()
    async get(@Body() request: GetUserDto){
        const response = await this._userService.getUser(request);
        return response;
    }

    @Post()
    async create(@Body() request: CreateUserDto){
        const response = await this._userService.createUser(request);
        if(response === 201){
            return "Usuario creado correctamente.";
        }
    }
}