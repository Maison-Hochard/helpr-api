import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public } from "../auth/decorators/public.decorator";
import { LinearService } from "./linear.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { createIssueInput } from "./linear.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("linear")
export class LinearController {
  constructor(private readonly linearService: LinearService) {}

  @Public()
  @Post("webhook")
  async webhook(@Body() body) {
    return await this.linearService.handleWebhook(body);
  }

  @Post("create-webhook")
  async createWebhook(
    @CurrentUser() user: JwtPayload,
    @Body("teamId") teamId: string,
  ) {
    return await this.linearService.createWebhook(user.id, teamId);
  }

  @Post("add-credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.linearService.createCredentials(user.id, accessToken);
  }

  @Post("create-issue")
  async createIssue(
    @CurrentUser() user: JwtPayload,
    @Body() issue: createIssueInput,
  ) {
    return await this.linearService.createIssue(user.id, issue);
  }

  @Get("teams")
  async getTeams(@Body("accessToken") accessToken: string) {
    return await this.linearService.getTeams(accessToken);
  }
}
