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
import { JwtService } from '@nestjs/jwt';
import { PermissionData } from 'src/roles/models/data/PermissionData';

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
        private readonly _roleService: RolesService,
        private readonly _jwtService: JwtService
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
                relations: ['rol','company'],
                select: {
                    rol: {
                        name: true
                    },
                    company: {
                        id: true,
                        name: true
                    }
                }
            });

            if(!user)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Invalid parameters" };
            
            // Remove properties to user
            delete user.created_at;
            delete user.updated_at;

            // Validate password
            const validatePassword = await comparePassword(request.password, user.password);

            if(!validatePassword)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Invalid parameters" };

            // Delete unnecesary props to user
            delete user.password;
            delete user.isActive;

            // Get permissions
            const role = await this._roleService.getRole(user.rol.id)

            if(!role)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Invalid parameters" };

            
            const permissionsFormat = await this.getPermissionStrings(role.permissions);

            // JWT
            const payload = {sub: user.id, username: user.userName, b: user.branchId};
            const token = await this._jwtService.sign(payload, {
                secret: "dental..gt$2024E"
            });
            const company = await this._companyRepository.findOne({
                where: {
                    id: user.company.id
                }
            });

            if(!company || !company.active)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Invalid parameters" };

            const properties = await this._propertiesRepository.find({
                where: {
                    companyId: company.id
                },
                select: {
                    logo: true,
                    header: true,
                    footer: true,
                    primaryColor: true,
                    primaryButtonColor: true,
                    secondaryColor: true,
                    secondaryButtonColor: true
                }
            });

            return {...user, access_token: token, permissions: permissionsFormat, properties: properties };
        }
        catch(error){
            this._logger.error("Auth error:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error" };
        }
    }

    async validateToken(token: string){
        try {
            const result = await this._jwtService.verify(token);
    
            // Find user and validate status
            if(!this._userRepository.findOneBy({
                id: result.sub,
                isActive: true
            }))
                return false;
    
            return result.sub ?? 0;
        }
        catch(error){
            return false;
        }
    }

    async getPermissionStrings(permissions: any[]): Promise<string[]> {
        const permissionMap = new Map<number, PermissionData>();
    
        permissions.forEach(permission => {
          permissionMap.set(permission.id, permission);
        });
    
        const result: string[] = [];
    
        permissions.forEach(permission => {
          if (permission.parentId === 0) {
            this.buildPermissionString(permission, permissionMap, result);
          }
        });
    
        return result;
    }
    
    private buildPermissionString(
        permission: PermissionData,
        permissionMap: Map<number, PermissionData>,
        result: string[],
        currentString: string = '',
      ) {
        const newString = currentString ? `${currentString}:${permission.name}` : permission.name;
    
        const children = Array.from(permissionMap.values()).filter(p => p.parentId === permission.id);
    
        if (children.length > 0) {
          children.forEach(child => {
            this.buildPermissionString(child, permissionMap, result, newString);
          });
        } else {
          result.push(newString);
        }
    }
}