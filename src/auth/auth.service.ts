import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './models/request/SignInDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/user/models/data/UserData';
import { Repository } from 'typeorm';
import comparePassword from 'src/helpers/password/comparePassword';
import { RolesService } from 'src/roles/role.service';
import { RoleData } from 'src/roles/models/data/RoleData';
import { PropertiesData } from 'src/company/models/data/PropertiesData';
import { CompanyData } from 'src/company/models/data/CompanyData';

@Injectable()
export class AuthService {

    private _logger: Logger;

    constructor(
        @InjectRepository(UserData)
        private readonly _userRepository: Repository<UserData>,
        @InjectRepository(PropertiesData)
        private readonly _propertiesRepository: Repository<PropertiesData>,
        @InjectRepository(CompanyData)
        private readonly _companyRepository: Repository<CompanyData>,
        private readonly _roleService: RolesService
    ){
        this._logger = new Logger(AuthService.name);
    }
    
    // SignIn
    async signIn(request: SignInDto){
        try {
            // Validate user
            const user = await this._userRepository.findOne({
                where: {
                    userName: request.userName,
                    isActive: true
                },
                relations: ['rol', 'company']
            });

            if(!user)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error" };
            
            // Validate password
            const validatePassword = await comparePassword(request.password, user.password);

            if(!validatePassword)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error" };

            // Delete unnecesary props to user
            delete user.password;
            delete user.isActive;

            // Get permissions
            const role = await this._roleService.getRole(user.rol.id)

            if(!role)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error" };

            // JWT
            const payload = {sub: user.id, username: user.userName};
            const company = await this._companyRepository.findOne({
                where: {
                    id: user.company.id
                }
            });

            if(!company || !company.active)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error" };

            const properties = await this._propertiesRepository.findOneBy({
                companyId: company.id
            });

            console.log('prop', company);
            return {...user, access_token: "a", permissions: role['permissions'], properties: properties };
        }
        catch(error){
            this._logger.error("Auth error:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error" };
        }
    }
}