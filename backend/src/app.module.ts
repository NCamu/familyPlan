//
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service'; // Importez-le
import { SlotsModule } from './slots/slots.module';

@Module({
  imports: [SlotsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService], // Ajoutez PrismaService ici
})
export class AppModule {}
