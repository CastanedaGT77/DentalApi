import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/user/models/data/UserData';
import { RolesService } from 'src/roles/role.service';
import { RoleData } from 'src/roles/models/data/RoleData';
import { PermissionData } from 'src/roles/models/data/PermissionData';
import { RolePermissionData } from 'src/roles/models/data/RolePermissionData';
import { PropertiesData } from 'src/company/models/data/PropertiesData';
import { CompanyData } from 'src/company/models/data/CompanyData';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserData, RoleData, PermissionData, RolePermissionData, PropertiesData, CompanyData]),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesService]
})
export class AuthModule {}
