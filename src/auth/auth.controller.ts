import { Body, Controller, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './models/request/SignInDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly _authService: AuthService
    ){}

    @Post()
    async signIn(@Body() request: SignInDto){
        const response = await this._authService.signIn(request);
        return response;
    }
}