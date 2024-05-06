import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
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

    constructor(
        @InjectRepository(UserData)
        private _userRepository: Repository<UserData>,
        @InjectRepository(RoleData)
        private _roleRepository: Repository<RoleData>
    ){}
    

    async getAll() : Promise<UserModel[]> {
        try {
            const users = await this._userRepository.find();
            let usersModel: UserModel[] = [];
            usersModel = users.map(u => {
                const userModel: UserModel = {
                    ...u
                }
                return userModel;
            });
            return usersModel;
        }
        catch(error){
            console.log("UserService:GetAll", error);
            return null;
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

    async createUser(request: CreateUserDto): Promise<void | Number> {
        try {
            const hashedPassword = await hashPassword(request.password);
            const generatedUserName = generateUserName(request.firstName, request.lastName);

            const role = await this._roleRepository.findOneBy({
                id: request.role
            });

            if(!role)
                throw new Error();

            const newUser: Partial<UserData> = {
                ...request,
                rol: role,
                userName: generatedUserName,
                password: hashedPassword
            };
            
            const resp = await this._userRepository.save(newUser);
            return 201;
        }
        catch(error){
            return null;
        }
    }
}
