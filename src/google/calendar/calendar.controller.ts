import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { RoleGuard } from "../../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Public } from "../../auth/decorators/public.decorator";
import { CalendarService } from "./calendar.service";
import { JwtPayload } from "../../auth/auth.service";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { createCalendarInput, createEventInput } from "./calendar.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("calendar")
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Public()
  @Post("webhook")
  async webhook() {
    return await this.calendarService.handleWebhook();
  }

  @Post("create-webhook")
  async createWebhook(@CurrentUser() user: JwtPayload) {
    return await this.calendarService.createWebhook(user.id);
  }

  @Post("create-calendar")
  async createCalendar(
    @CurrentUser() user: JwtPayload,
    @Body() calendar: createCalendarInput,
  ) {
    return await this.calendarService.createCalendar(user.id, calendar);
  }

  @Post("create-event")
  async createEvent(
    @CurrentUser() user: JwtPayload,
    @Body() event: createEventInput,
  ) {
    return await this.calendarService.createEvent(user.id, event);
  }
}
