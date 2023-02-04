import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ProviderService } from "./provider.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Action } from "@prisma/client";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("provider")
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get("/get-credentials")
  async getCredentials(@CurrentUser() user: JwtPayload) {
    return this.providerService.getCredentials(user.id);
  }

  @Post("/add-action")
  async addAction(@Body() action: Action) {
    return this.providerService.addAction(action);
  }
}
