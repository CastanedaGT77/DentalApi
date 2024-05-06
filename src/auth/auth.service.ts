import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './models/request/SignInDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/user/models/data/UserData';
import { Repository } from 'typeorm';
import comparePassword from 'src/helpers/password/comparePassword';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { RoleData } from 'src/roles/models/data/RoleData';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserData)
        private readonly _userRepository: Repository<UserData>,
        private readonly _jwtService: JwtService,
        private readonly _roleService: RolesService
    ){}
    
    // SignIn
    async signIn(request: SignInDto): Promise<any>{
        // Validate user
        const user = await this._userRepository.findOne({
            where: {
                userName: request.userName,
                isActive: true
            },
            relations: ['rol']
        });

        if(!user)
            return HttpStatus.NOT_FOUND;

        // Validate password
        const validatePassword = await comparePassword(request.password, user.password);

        if(!validatePassword)
            return HttpStatus.NOT_FOUND;
        
    
        // Delete unnecesary props to user
        delete user.password;
        delete user.isActive;

        // Get permissions
        console.log("us us us ", user);
        const role = await this._roleService.getRole({id: user.rol.id})

        // JWT
        const payload = {sub: user.id, username: user.userName};

        return {...user, access_token: await this._jwtService.signAsync(payload), permissions: role['permissions']};
    }
}