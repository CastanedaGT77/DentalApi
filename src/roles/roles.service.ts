import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleData } from './models/data/RoleData';
import { Equal, ILike, Not, Repository } from 'typeorm';
import { PermissionData } from './models/data/PermissionData';
import { RolePermissionData } from './models/data/RolePermissionData';
import { CreateRoleDto } from './models/requests/CreateRoleDto';
import { GetRoleDto } from './models/requests/GetRoleDto';
import { DeleteRoleDto } from './models/requests/DeleteRoleDto';
import { EditRoleDto } from './models/requests/EditRoleDto';

@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(RoleData)
        private readonly _roleRepository: Repository<RoleData>,
        @InjectRepository(PermissionData)
        private readonly _permissionRepository: Repository<PermissionData>,
        @InjectRepository(RolePermissionData)
        private readonly _rolePermissionRepository: Repository<RolePermissionData>,
    ){
    }

    // Create role
    async createRole(request: CreateRoleDto){
        try {
            // Validate if name exists
            const duplicated = await this._roleRepository.findOne({
                where: {
                    name: ILike(`%${request.name}%`)
                }
            });

            if(duplicated){
                return HttpStatus.BAD_REQUEST;
            }

            // Remove duplicate permissions in lists
            const newPermissions = Array.from(new Set(request.permissions));

            // Create role
            const createdRole = await this._roleRepository.create(request);
            const savedRole = await this._roleRepository.save(createdRole);
            
            // Assign permissions
            for(let i=0; i < newPermissions.length; i++){
                try {
                    const foundPermission = await this._permissionRepository.findOneBy({
                        id: newPermissions[i]
                    });
                    if(foundPermission){
                        let rolePermission: Partial<RolePermissionData> = {
                            roleId: savedRole.id,
                            permissionId: newPermissions[i]
                        };
                        const createdRolePermission = await this._rolePermissionRepository.create(rolePermission);
                        await this._rolePermissionRepository.save(createdRolePermission);
                    }
                } catch(error){
                    console.log("ERROR ASIGNANDO PERMISO:", error);
                }
            }
            // Assign permissions
            return true;
        }
        catch(error){
            console.log(error);
            return null;
        }
    }

    // Edit role
    async editRole(request: EditRoleDto){
        try {
            // Validate if name exists
            const duplicated = await this._roleRepository.findOne({
                where: {
                    id: Not(Equal(request.id)),
                    name: ILike(`%${request.name}%`)
                }
            });

            if(duplicated){
                return HttpStatus.BAD_REQUEST;
            }

            const role = await this._roleRepository.findOne({
                where: {
                    id: request.id
                }
            });
            role.name = request.name;

            const updated = await this._roleRepository.save(role);

            // Delete and asign permissions
            await this._rolePermissionRepository.delete({
                roleId: role.id
            });

            // Remove duplicate permissions in lists
            const newPermissions = Array.from(new Set(request.permissions));
            // Assign permissions
            for(let i=0; i < newPermissions.length; i++){
                try {
                    const foundPermission = await this._permissionRepository.findOneBy({
                        id: newPermissions[i]
                    });
                    if(foundPermission){
                        let rolePermission: Partial<RolePermissionData> = {
                            roleId: role.id,
                            permissionId: newPermissions[i]
                        };
                        const createdRolePermission = await this._rolePermissionRepository.create(rolePermission);
                        await this._rolePermissionRepository.save(createdRolePermission);
                    }
                } catch(error){
                    console.log("ERROR ASIGNANDO PERMISO:", error);
                }
            }
            

            return true;
        } catch(error){
            return null;
        }
    }

    async getRole(request: GetRoleDto){
        try {
            // Get role
            const role = await this._roleRepository.findOneBy({
                id: request.id
            });

            if(!role){
                return HttpStatus.BAD_REQUEST;
            }

            // Get permissions
            const permissions = await this._rolePermissionRepository.findBy({
                roleId: request.id
            });

            const permissionName: string[] = [];
            for(let i=0; i < permissions.length; i++){
                const p = await this._permissionRepository.findOneBy({
                    id: permissions[i].permissionId
                });
                if(p){
                    permissionName.push(p.name);
                }
            }

            return {role, permissions: permissionName};
        } catch(error){
            return null;
        }
    }

    async getPermissions(){
        try {
            const response = await this._permissionRepository.find();
            return response;
        }
        catch(error){
            return null
        }
    }

    async deleteRole(request: DeleteRoleDto){
        try {
            await this._rolePermissionRepository.delete({
                roleId: request.id
            });

            await this._roleRepository.delete({
                id: request.id
            });
            return true;
        } catch(error){
            return null;
        }
    }
}