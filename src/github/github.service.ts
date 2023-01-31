import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../user/user.service";

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async createWebhook(teamId: string, accessToken: string) {}

  async createCredentials(userId: number, accessToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
  }

  async getUser(userId: number) {}
}
