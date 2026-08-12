import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserDto {
  id: number;
  email: string;
  nome: string;
  tipo_perfil_id: number;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
