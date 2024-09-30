import { Global, Module } from '@nestjs/common';
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
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserData, RoleData, PermissionData, RolePermissionData, PropertiesData, CompanyData]),
    JwtModule.register({
      global: true,
      secret: "dental..gt$2024E",
      signOptions: {expiresIn: '600s'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesService],
  exports: [AuthService]
})
export class AuthModule {}
