import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Role } from '../../../__helpers__';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../__helpers__/decorators';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        ) { }
        
        async canActivate(context: ExecutionContext): Promise<boolean> {
            const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            
            if (!requiredRoles) {
                return false;
            }
            
            try {
                
                const req = context.switchToHttp().getRequest();

                const userRole = String(req?.["user"].role);

                if (!requiredRoles.some((requiredRole) => userRole.includes(requiredRole))) {
                throw new BadRequestException();
            }

            return true;

            } catch (e) {
                console.log(e.message)
                throw new ForbiddenException();
            }

        }
    
    }