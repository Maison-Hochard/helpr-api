import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../user/user.service";
import { GithubService } from "../github/github.service";
import { ProviderService } from "../provider/provider.service";

@Injectable()
export class LinearService {
  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
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
      const linearUser = await this.prisma.providerCredentials.findFirst({
        where: {
          providerId: body.data.creatorId,
        },
      });
      if (!linearUser) return;
      const githubUser = await this.prisma.providerCredentials.findFirst({
        where: {
          provider: "github",
          userId: linearUser.userId,
        },
      });
      if (!githubUser) return;
      return await this.githubService.createBranch(
        linearUser.userId,
        githubUser.accessToken,
        "nuxtjs-boilerplate",
        branchName,
      );
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

  async createCredentials(userId: number, accessToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("Invalid access token");
    await this.providerService.addCredentials(
      user.id,
      linearUser.id,
      "linear",
      accessToken,
    );
  }
}
