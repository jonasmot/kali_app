import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TreinoModule } from './treino/treino.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TreinoModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
