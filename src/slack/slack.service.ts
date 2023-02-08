import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { WebClient } from "@slack/web-api";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { ProviderCredentials } from "@prisma/client";

@Injectable()
export class SlackService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async getTeams(accessToken: string) {
    const slackClient = new WebClient(accessToken);
    const slackUser = await slackClient.conversations.list();
    return slackUser.channels.map((channel) => {
      return { id: channel.id, name: channel.name };
    });
  }
  async createWebhook(userId: number, teamId: string) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "slack",
      true,
    );
    const slackClient = new WebClient(accessToken);
    const env = this.configService.get("env");
    const webhookProdUrl = this.configService.get("api_url") + "/slack/webhook";
    const webhookDevUrl =
      "https://eb3c-2a02-8440-5340-5e69-518c-252e-d6b3-5338.eu.ngrok.io/slack/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    return await slackClient.conversations.create({
      name: "webhook",
      is_private: true,
    });
  }
  async postMessage(userId: number, webhookId: string, message: string) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "slack",
      true,
    );
    const slackClient = new WebClient(accessToken);
    await slackClient.chat.postMessage({
      channel: webhookId,
      text: message,
    });
  }

  async createChannel(userId: number, channelName: string) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "slack",
      true,
    );
    const slackClient = new WebClient(accessToken);
    const result = await slackClient.conversations.create({
      name: channelName,
    });
    return result.channel.id;
  }

  async createCredentials(
    userId: number,
    accessToken: string,
  ): Promise<ProviderCredentials> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");
    const slackClient = new WebClient(accessToken);
    const slackUser = await slackClient.auth.test();
    if (!slackUser.user_id)
      throw new BadRequestException("invalid_credentials");
    return await this.providerService.addCredentials(
      user.id,
      slackUser.user_id,
      "slack",
      accessToken,
    );
  }
}
