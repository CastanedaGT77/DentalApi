import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/user/models/data/UserData';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RolesService } from 'src/roles/roles.service';
import { RoleData } from 'src/roles/models/data/RoleData';
import { PermissionData } from 'src/roles/models/data/PermissionData';
import { RolePermissionData } from 'src/roles/models/data/RolePermissionData';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserData, RoleData, PermissionData, RolePermissionData]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '10800s'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesService]
})
export class AuthModule {}
