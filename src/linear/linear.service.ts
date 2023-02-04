import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { ProviderCredentials } from "@prisma/client";
import { createIssueInput } from "./linear.type";

@Injectable()
export class LinearService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async getTeams(accessToken: string) {
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    const teams = await linearUser.teams();
    return teams.nodes.map((team) => {
      return { id: team.id, name: team.name };
    });
  }

  async handleWebhook(body: any) {
    if (body.data) {
      const { title, number, labels, team } = body.data;
      const prefix = (
        labels && labels[0].name ? labels[0].name : "feature"
      ).toLowerCase();
      const teamName = (team && team.name ? team.name : title).toLowerCase();
      const branchName = `${prefix}/${teamName}-${number}`;
      console.log(branchName);
    }
  }

  async createWebhook(userId: number, teamId: string) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linear",
      true,
    );
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/linear/webhook";
    const webhookDevUrl =
      "https://eb3c-2a02-8440-5340-5e69-518c-252e-d6b3-5338.eu.ngrok.io/linear/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    console.log(finalUrl);
    const response = await linearClient.createWebhook({
      url: finalUrl,
      resourceTypes: ["Issue"],
      teamId: teamId,
    });
    console.log(response);
    return response;
  }

  async createCredentials(
    userId: number,
    accessToken: string,
  ): Promise<ProviderCredentials> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("invalid_credentials");
    return await this.providerService.addCredentials(
      user.id,
      linearUser.id,
      "linear",
      accessToken,
    );
  }

  async createIssue(userId: number, createIssueInput: createIssueInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linear",
      true,
    );
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("invalid_credentials");
    const team = await linearClient.team(createIssueInput.teamId);
    if (!team) throw new BadRequestException("team_not_found");
    await linearClient.createIssue({
      title: createIssueInput.title,
      teamId: createIssueInput.teamId,
    });
    return {
      message: "issue_created",
    };
  }
}
