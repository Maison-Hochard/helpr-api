import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public } from "../auth/decorators/public.decorator";
import { SlackService } from "./slack.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { SlackCommandInput, postMessageInput, createChannelInput } from "./slack.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("slack")
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post("post-message")
  async postMessage(@Body() postMessage: postMessageInput) {
    return await this.slackService.postMessage(postMessage);
  }

  @Post("create-channel")
  async createChannel(@Body() createChannelInput: createChannelInput) {
    return await this.slackService.createChannel(createChannelInput);
  }
  // @Post("command")
  // async handleSlackCommand(@Body() slackCommand: SlackCommand) {
  //   return await this.slackService.handleSlackCommand(slackCommand);
  // }
}
