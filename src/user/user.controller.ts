import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './models/requests/CreateUserDto';
import { UserService } from './user.service';
import { GetUserDto } from './models/requests/GetUserDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
//@UseGuards(AuthGuard)
export class UserController {

    constructor(
        private readonly _userService: UserService
    ){}

    @Get()
    async getAll(){
        return await this._userService.getAll();
    }

    @Get('/:id')
    async get(@Param('id') id: number){
        return await this._userService.getUser(id);
    }

    @Post()
    async create(@Body() request: CreateUserDto){
        return await this._userService.createUser(request);
    }
}