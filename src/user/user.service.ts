import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './models/requests/CreateUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from './models/data/UserData';
import hashPassword from 'src/helpers/password/hashPassword';
import generateUserName from 'src/helpers/password/generateUserName';
import { GetUserDto } from './models/requests/GetUserDto';
import { UserModel } from './models/types/UserModel';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserData)
        private _userRepository: Repository<UserData>
    ){}
    

    async getUser(request: GetUserDto): Promise<UserModel> {
        try {
            const user = await this._userRepository.findOneBy({
                id: request.id
            });
            if(!user)
                return HttpStatus.NOT_FOUND;
            return HttpStatus.OK;
        }
        catch(error){
            return null;
        }
    }

    async createUser(request: CreateUserDto): Promise<void | Number> {
        try {
            const hashedPassword = await hashPassword(request.password);
            const generatedUserName = generateUserName(request.firstName, request.lastName);
            const newUser: Partial<UserData> = {
                ...request,
                userName: generatedUserName,
                password: hashedPassword
            };

            // TO-DO: Send email

            await this._userRepository.save(newUser);
            return 201;
        }
        catch(error){
            return null;
        }
    }
}
