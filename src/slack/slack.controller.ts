import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public } from "../auth/decorators/public.decorator";
import { SlackService } from "./slack.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("slack")
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post("create-webhook")
  async createWebhook(
    @CurrentUser() user: JwtPayload,
    @Body("teamId") teamId: string,
  ) {
    await this.slackService.createWebhook(user.id, teamId);
    return {
      message: "webhook_created",
    };
  }

  @Post("add-credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.slackService.createCredentials(user.id, accessToken);
  }
  @Post("post-message")
  async postMessage(
    @CurrentUser() user: JwtPayload,
    @Body("channelId") channelId: string,
    @Body("message") message: string,
  ) {
    return await this.slackService.postMessage(user.id, channelId, message);
  }
  @Post("create-channel")
  async createChannel(
    @CurrentUser() user: JwtPayload,
    @Body("channelName") channelName: string,
  ) {
    return await this.slackService.createChannel(user.id, channelName);
  }
  async getTeams(@Body("accessToken") accessToken: string) {
    return await this.slackService.getTeams(accessToken);
  }
}
