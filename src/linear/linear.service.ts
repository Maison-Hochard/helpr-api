import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../user/user.service";

@Injectable()
export class LinearService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
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

  async createWebhook(teamId: string, accessToken: string) {
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    return await linearClient.createWebhook({
      url: "https://8fca-78-126-205-77.eu.ngrok.io/linear/webhook",
      resourceTypes: ["Issue"],
      teamId: teamId,
    });
  }

  async createCredentials(userId: number, accessToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("Invalid access token");
    await this.prisma.providerCredentials.create({
      data: {
        provider: "linear",
        accessToken: accessToken,
        providerId: linearUser.id,
        userId: user.id,
      },
    });
    const teams = await this.getTeams(accessToken);
    await Promise.all(
      teams.map((team) => this.createWebhook(team.id, accessToken)),
    );
    return { message: "Linear credentials created" };
  }

  async getUser(userId: number) {
    const userLinear = await this.prisma.providerCredentials.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!userLinear) throw new BadRequestException("User not found");
    if (userLinear) {
      const linearClient = new LinearClient({
        apiKey: userLinear.accessToken,
      });
      const graphQLClient = linearClient.client;
      const { data } = await graphQLClient.rawRequest(
        `query User {
          users {
            id
            name
            email
            avatarUrl
            teams {
              nodes {
                id
                name
              }
            }
          }
        }`,
      );
      return data;
    }
  }
}
