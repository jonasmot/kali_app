import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ExerciciosModule } from './exercicios/exercicios.module';
import { TreinosModule } from './treinos/treinos.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// Vídeos são servidos pelo Supabase Storage (bucket público).
// O módulo ServeStatic foi removido pois não é mais necessário.

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsuariosModule,
    ExerciciosModule,
    TreinosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
