import { BadRequestException, Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './models/requests/CreateUserDto';
import { UserService } from './user.service';
import { GetUserDto } from './models/requests/GetUserDto';

@Controller('user')
export class UserController {

    constructor(
        private readonly _userService: UserService
    ){}

    @Get()
    async get(@Body() request: GetUserDto){
        const response = await this._userService.getUser(request);
        if(response === 404)
            throw new BadRequestException('User was not found');
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