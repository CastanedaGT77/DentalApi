import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from './models/data/UserData';
import { RoleData } from 'src/roles/models/data/RoleData';
import { CompanyData } from 'src/company/models/data/CompanyData';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserData, RoleData, CompanyData])],
  controllers: [UserController],
  providers: [UserService, EmailService]
})
export class UserModule {}