import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleData } from './models/data/RoleData';
import { Equal, ILike, Not, Repository } from 'typeorm';
import { PermissionData } from './models/data/PermissionData';
import { RolePermissionData } from './models/data/RolePermissionData';
import { CreateRoleDto } from './models/requests/CreateRoleDto';
import { GetRoleDto } from './models/requests/GetRoleDto';
import { DeleteRoleDto } from './models/requests/DeleteRoleDto';
import { EditRoleDto } from './models/requests/EditRoleDto';
import { RoleModel } from './models/types/RoleModel';
import { UserData } from 'src/user/models/data/UserData';

@Injectable()
export class RolesService {
    private _logger: Logger;

    constructor(
        @InjectRepository(RoleData)
        private readonly _roleRepository: Repository<RoleData>,
        @InjectRepository(PermissionData)
        private readonly _permissionRepository: Repository<PermissionData>,
        @InjectRepository(RolePermissionData)
        private readonly _rolePermissionRepository: Repository<RolePermissionData>,
        @InjectRepository(UserData)
        private readonly _userRepository: Repository<UserData>
    ){
        this._logger = new Logger(RolesService.name);
    }

    // Get all roles
    async getAll(){
        try {
            // Get roles
            const roles: RoleData[] = await this._roleRepository.find();
            let rolesModel: RoleModel[] = [];
            // Get permissions
            const permissions: PermissionData[] = await this._permissionRepository.find({
                select: {
                    id: true,
                    name: true
                }
            });
            // Get role permissions
            const rolePermissions: RolePermissionData[] = await this._rolePermissionRepository.find();
            // Get role permission
            roles.forEach(r => {
                let temp: RoleModel = {id: r.id, name: r.name};
                temp.permissions = permissions.filter(p => rolePermissions.filter(rp => rp.roleId === r.id).map(rr => rr.permissionId).includes(p.id));
                rolesModel.push(temp);
            });
            return rolesModel;
        } catch(error){
            this._logger.error("GET_ALL:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
        }
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

            if(duplicated)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters: Duplicated" }

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
                    this._logger.error(`CREATE: ${JSON.stringify(error)}`);
                }
            }
            return { code: HttpStatus.CREATED, msg: "Role created" };
        }
        catch(error){
            this._logger.error(`CREATE: ${JSON.stringify(error)}`);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
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

            if(duplicated)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters: Duplicated" };

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
            return { code: HttpStatus.OK, msg: "Role updated" };
        } catch(error){
            this._logger.error("UPDATE: ", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
        }
    }

    async getRole(id: number){
        try {
            // Get role
            const role = await this._roleRepository.findOneBy({
                id: id
            });

            if(!role)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" }

            // Get permissions
            const permissions = await this._rolePermissionRepository.findBy({
                roleId: id
            });

            const permissionName: {id: number, name: string}[] = [];
            for(let i=0; i < permissions.length; i++){
                const p = await this._permissionRepository.findOneBy({
                    id: permissions[i].permissionId
                });
                if(p){
                    permissionName.push({id: p.id, name: p.name});
                }
            }

            return {role, permissions: permissionName};
        } catch(error){
            this._logger.error("Get Role:", JSON.stringify(error));
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Error getting role"};
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
            // Validate if role can be deleted
            const users = await this._userRepository.find({
                where: {
                    rol: {id: request.id}
                }
            });

            if(users.length > 0){
                return { code: HttpStatus.BAD_REQUEST, msg: "Rol cannot be deleted, is associated with user" };
            }

            await this._rolePermissionRepository.delete({
                roleId: request.id
            });

            await this._roleRepository.delete({
                id: request.id
            });
            return { code: HttpStatus.OK, msg: "Role deleted"};
        } catch(error){
            this._logger.error("DELETE: ", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
        }
    }
}