import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from './models/data/UserData';
import { RoleData } from 'src/roles/models/data/RoleData';

@Module({
  imports: [TypeOrmModule.forFeature([UserData, RoleData])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
