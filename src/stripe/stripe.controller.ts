import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public } from "../auth/decorators/public.decorator";
import { StripeService } from "./stripe.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { createIssueInput } from "./stripe.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  /*  @Public()
  @Post("webhook")
  async webhook(@Body() body) {
    return await this.stripeService.handleWebhook(body);
  }

  @Post("create-webhook")
  async createWebhook(
    @CurrentUser() user: JwtPayload,
    @Body("teamId") teamId: string,
  ) {
    return await this.stripeService.createWebhook(user.id, teamId);
  }*/

  @Post("add-credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.stripeService.createCredentials(user.id, accessToken);
  }

  @Post("create-issue")
  async createIssue(
    @CurrentUser() user: JwtPayload,
    @Body() issue: createIssueInput,
  ) {
    return await this.stripeService.createIssue(user.id, issue);
  }
}
