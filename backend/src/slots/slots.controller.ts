/*import { Controller } from '@nestjs/common';

@Controller('slots')
export class SlotsController {}
*/
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  async getWeek(@Query('weekId') weekId: string) {
    return this.slotsService.getWeekSlots(weekId);
  }

  @Post()
  async saveSlot(@Body() body: any) {
    return this.slotsService.upsertSlot(body);
  }
}