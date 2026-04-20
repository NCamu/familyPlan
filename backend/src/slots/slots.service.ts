import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SlotsService {
  constructor(private prisma: PrismaService) {}

  // Récupérer tous les créneaux d'une semaine donnée
  async getWeekSlots(weekId: string) {
    return this.prisma.slot.findMany({
      where: { weekId },
    });
  }

  // Cette fonction gère maintenant à la fois l'ajout, la modification ET la suppression (gomme)
  async upsertSlot(data: {
    day: string;
    startTime: number;
    user: string;
    activity: string;
    weekId: string;
  }) {
    // 1. LOGIQUE DE LA GOMME : Si l'activité est vide, on supprime
    if (!data.activity || data.activity.trim() === '') {
      return this.prisma.slot.deleteMany({
        where: {
          day: data.day,
          startTime: data.startTime,
          user: data.user,
          weekId: data.weekId,
        },
      });
    }

    // 2. LOGIQUE D'ENREGISTREMENT : Sinon, on crée ou on met à jour
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
