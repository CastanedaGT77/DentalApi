import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
  
    constructor(
      @Inject(AuthService) private authService: AuthService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      let b = 0;
      if (!token) {
        throw new UnauthorizedException();
      }

      try {
        const validation = await this.authService.validateToken(token);
        if(validation === false){
          throw new UnauthorizedException();
        }
        b = validation;
      } 
      catch {
        throw new UnauthorizedException();
      }

      request['br'] = b;
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }