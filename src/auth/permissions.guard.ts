import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequirePermissions } from "./permissions.decorator";

@Injectable()
export class RequirePermissionsGuard {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        console.log("WHAT:", requiredPermissions);
        if (!requiredPermissions) {
          return true;
        }
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;
    
        if (!user || !user.permissions) {
          return false;
        }
    
        const hasPermission = () => requiredPermissions.every(permission => user.permissions.includes(permission));
        return hasPermission();
    }
}