import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials.
   * @param email The user's email.
   * @param senha The user's password.
   * @returns The user object without the password if validation is successful, null otherwise.
   */
  async validarUsuario(email: string, senha: string): Promise<any> {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  /**
   * Logs a user in and returns a JWT token.
   * @param usuario The user to log in.
   * @returns An object containing the access token and the user info.
   */
  async login(usuario: any) {
    const payload = { email: usuario.email, sub: usuario.id, nome: usuario.nome, tipo_perfil_id: usuario.tipo_perfil_id };
    return {
      access_token: this.jwtService.sign(payload),
      usuario,
    };
  }

  /**
   * Registers a new user and logs them in.
   * @param dto The registration DTO.
   * @returns An object containing the access token and the user info.
   */
  async registrar(dto: RegisterDto) {
    const usuarioCriado = await this.usuariosService.criar(dto);
    const { senha, ...usuario } = usuarioCriado;
    return this.login(usuario);
  }

  /**
   * Retrieves the current user's profile.
   * @param userId The user's ID.
   * @returns The user object without the password.
   */
  async me(userId: number) {
    const usuario = await this.usuariosService.buscarPorId(userId);
    if (!usuario) {
      throw new UnauthorizedException();
    }
    const { senha, ...result } = usuario;
    return result;
  }
}
