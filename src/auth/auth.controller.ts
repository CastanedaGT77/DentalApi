import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { SignInDto } from './models/request/SignInDto';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './models/request/ResetPasswordDto';

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

    @Post('reset')
    async resetPassword(@Body() request: ResetPasswordDto){
        const response = await this._authService.resetPassword(request);
        return {code: HttpStatus.OK, message: "Password has been successfullu reset"};
    }
}