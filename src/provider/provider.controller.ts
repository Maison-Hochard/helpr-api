import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ProviderService } from "./provider.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("provider")
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get("/credentials")
  async getCredentials(@CurrentUser() user: JwtPayload) {
    return this.providerService.getCredentials(user.id);
  }
}
