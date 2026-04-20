import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { PrismaService } from '../prisma.service'; // Importez-le ici aussi

@Module({
  controllers: [SlotsController],
  providers: [SlotsService, PrismaService], // Ajoutez-le ici
})
export class SlotsModule {}
