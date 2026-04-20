/*import { Injectable } from '@nestjs/common';

@Injectable()
export class SlotsService {}*/
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Vérifiez bien le chemin relatif

@Injectable()
export class SlotsService {
  constructor(private prisma: PrismaService) {} // C'est cette ligne qui rend "this.prisma" disponible


  // Récupérer tous les créneaux d'une semaine donnée
  async getWeekSlots(weekId: string) {
    return this.prisma.slot.findMany({
      where: { weekId },
    });
  }

  // Enregistrer ou mettre à jour un clic
  async upsertSlot(data: { day: string; startTime: number; user: string; activity: string; weekId: string }) {
    return this.prisma.slot.upsert({
      where: {
        day_startTime_user_weekId: {
          day: data.day,
          startTime: data.startTime,
          user: data.user,
          weekId: data.weekId,
        },
      },
      update: { activity: data.activity },
      create: data,
    });
  }
}