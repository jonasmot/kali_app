import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async validarUsuario(email: string, pass: string): Promise<any> {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    if (usuario && await bcrypt.compare(pass, usuario.senha)) {
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(usuario: any) {
    const payload = { email: usuario.email, sub: usuario.id, name: usuario.name };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, email: usuario.email, name: usuario.name }
    };
  }

  async registrar(dados: any) {
    const usuario = await this.usuariosService.criar(dados);
    const { senha, ...result } = usuario;
    return result;
  }
}
