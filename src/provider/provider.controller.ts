import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ProviderService } from "./provider.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  createActionInput,
  createProviderInput,
  createTriggerInput,
} from "./provider.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("provider")
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get("/providers")
  async getProviders() {
    return this.providerService.getProviders();
  }

  @Get("/get-credentials")
  async getCredentials(@CurrentUser() user: JwtPayload) {
    return this.providerService.getCredentials(user.id);
  }

  @Get("/get-available-actions")
  async getAvailableActions() {
    const actions = await this.providerService.getAvailableActions();
    return {
      message: "actions_found",
      data: actions,
    };
  }

  @Get("/user-services")
  async getUsersServices(@CurrentUser() user: JwtPayload) {
    return this.providerService.getUsersServices(user.id);
  }

  @Post("/add-provider")
  async addProvider(@Body() provider: createProviderInput) {
    return this.providerService.addProvider(provider);
  }

  @Post("/action")
  async createOrUpdateAction(@Body() action: createActionInput) {
    return this.providerService.createOrUpdateAction(action);
  }

  @Post("/add-trigger")
  async addTrigger(@Body() trigger: createTriggerInput) {
    return this.providerService.addTrigger(trigger);
  }
}
