import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './role.service';
import { RolesController } from './role.controller';
import { PermissionData } from './models/data/PermissionData';
import { RolePermissionData } from './models/data/RolePermissionData';
import { RoleData } from './models/data/RoleData';
import { UserData } from 'src/user/models/data/UserData';

@Module({
  imports: [TypeOrmModule.forFeature([RoleData, PermissionData, RolePermissionData, UserData])],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}