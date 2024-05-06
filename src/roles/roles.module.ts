import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionData } from './models/data/PermissionData';
import { RolePermissionData } from './models/data/RolePermissionData';
import { RoleData } from './models/data/RoleData';

@Module({
  imports: [TypeOrmModule.forFeature([RoleData, PermissionData, RolePermissionData])],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}