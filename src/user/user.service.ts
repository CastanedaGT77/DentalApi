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

@Injectable()
export class UserService {
    private _logger: Logger;

    constructor(
        @InjectRepository(UserData)
        private _userRepository: Repository<UserData>,
        @InjectRepository(RoleData)
        private _roleRepository: Repository<RoleData>
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

    async getUser(request: GetUserDto): Promise<UserModel> {
        try {
            const user = await this._userRepository.findOneBy({
                id: request.id
            });
            const userModel: UserModel = {...user};
            if(!user)
                return null;
            return userModel;
        }
        catch(error){
            return null;
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

            const newUser: Partial<UserData> = {
                ...request,
                rol: role,
                userName: generatedUserName,
                password: hashedPassword
            };
            
            await this._userRepository.save(newUser);
            return { code: HttpStatus.CREATED, msg: "User created."};
        }
        catch(error){
            this._logger.error(`CREATE: ${JSON.stringify(error)}`);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: error };
        }
    }
}
