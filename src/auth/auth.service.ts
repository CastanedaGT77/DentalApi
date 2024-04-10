import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './models/request/SignInDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/user/models/data/UserData';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserData)
        private readonly _userRepository: Repository<UserData>
    ){}
    
    // SignIn
    async signIn(request: SignInDto): Promise<any>{
        const user = await this._userRepository.findOne({
            where: {
                userName: request.userName
            }
        });

        if(!user)
            return HttpStatus.NOT_FOUND;
    }
}