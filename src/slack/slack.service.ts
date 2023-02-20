import { Controller, Post, Body, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { WebClient } from "@slack/web-api";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { SlackCommandInput, postMessageInput, createChannelInput } from "./slack.type";

@Injectable()
export class SlackService {
  private readonly slackClient: WebClient;
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {
    const bot_token = configService.get("slack.bot_access_token");
    this.slackClient = new WebClient(bot_token);
  }

  async postMessage(postMessage: postMessageInput) {
    await this.slackClient.chat.postMessage({
      channel: postMessage.channelId,
      text: postMessage.message,
    });
  }

  async createChannel(createChannelInput: createChannelInput) {
    const result = await this.slackClient.conversations.create({
      name: createChannelInput.channelName,
      is_private: createChannelInput.is_private,
    });
    return result.channel.id;
  }
  // async handleSlackCommand(slackCommand: SlackCommandInput) {
  //   switch (slackCommand.text) {
  //     case "create-channel-slack":
  //       // Code to create a channel in Slack
  //       break;
  //     case "post-message-slack":
  //       // Code to post a message inn Slack
  //       break;
  //     // Add more cases for additional commands
  //     default:
  //       // Code to handle unknown commands
  //       break;
  //   }
  // }
}
