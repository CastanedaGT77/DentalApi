import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './models/requests/CreateUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from './models/data/UserData';
import hashPassword from 'src/helpers/password/hashPassword';
import generateUserName from 'src/helpers/password/generateUserName';
import { GetUserDto } from './models/requests/GetUserDto';
import { UserModel } from './models/types/UserModel';
import { RoleData } from 'src/roles/models/data/RoleData';
import { CompanyData } from 'src/company/models/data/CompanyData';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
    private _logger: Logger;

    constructor(
        @InjectRepository(UserData)
        private _userRepository: Repository<UserData>,
        @InjectRepository(RoleData)
        private _roleRepository: Repository<RoleData>,
        @InjectRepository(CompanyData)
        private _companyRepository: Repository<CompanyData>,
        private readonly _emailService: EmailService
    ){
        this._logger = new Logger(UserService.name);
    }
    

    async getAll() {
        try {
            const users = await this._userRepository.find({
                relations: ['rol']
            });
            users.forEach(u => {
                delete u.password;
                delete u.updated_at;
                delete u.rol.created_at;
                delete u.rol.updated_at;
            });
            return users;
        }
        catch(error){
            this._logger.error("GET_ALL:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
        }
    }

    async getUser(id: number){
        try {
            const user = await this._userRepository.findOne({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    userName: true,
                    email: true,
                    created_at: true,
                    updated_at: true,
                    rol: {
                        id: true,
                        name: true
                    }
                },
                relations: ['rol']
            });

            if(!user)
                return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Invalid parameters" };

            
            return { code: HttpStatus.OK, data: user };
        }
        catch(error){
            this._logger.error("Get User: ", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting user." };
        }
    }

    async createUser(request: CreateUserDto) {
        try {
            const hashedPassword = await hashPassword(request.password);
            const generatedUserName = generateUserName(request.firstName, request.lastName);

            const role = await this._roleRepository.findOneBy({
                id: request.role
            });

            if(!role)
                return { code: HttpStatus.BAD_GATEWAY, msg: "Invalid parameteres: Role"}

            const companyId = 1;
            const company = await this._companyRepository.findOneBy({
                id: companyId
            });

            if(!company || !company.active)
                return { code: HttpStatus.BAD_GATEWAY, msg: "Invalid parameteres: Company"}

            
            // Set branch to user
            const branchId = request.allowBranchView ? 0 : request.branchId

            const newUser: Partial<UserData> = {
                ...request,
                rol: role,
                userName: generatedUserName,
                password: hashedPassword,
                company,
                branchId
            };
            
            await this._userRepository.save(newUser);

            // Send Email
            this._emailService.sendWelcome(company.name, `${newUser.firstName} ${newUser.lastName}` ,newUser.email, generatedUserName, request.password, "https://dental-app-gilt.vercel.app/");

            return { code: HttpStatus.CREATED, msg: "User created."};
        }
        catch(error){
            this._logger.error(`CREATE: ${JSON.stringify(error)}`);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "User could not be created" };
        }
    }
}
