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
        return await this._userService.getAll();
    }

    @Get()
    async get(@Body() request: GetUserDto){
        const response = await this._userService.getUser(request);
        return response;
    }

    @Post()
    async create(@Body() request: CreateUserDto){
        return await this._userService.createUser(request);
    }
}