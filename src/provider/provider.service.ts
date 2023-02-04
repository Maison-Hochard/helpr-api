import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { decrypt, encrypt } from "../utils";
import { Action } from "@prisma/client";

@Injectable()
export class ProviderService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async getCredentials(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
    return await this.prisma.providerCredentials.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async getCredentialsByProvider(
    userId: number,
    provider: string,
    decrypted = false,
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
    const credentials = await this.prisma.providerCredentials.findFirst({
      where: {
        userId: user.id,
        provider,
      },
    });
    if (decrypted) {
      credentials.accessToken = decrypt(credentials.accessToken);
    }
    return credentials;
  }

  async addCredentials(
    userId: number,
    providerId: string,
    provider: string,
    accessToken: string,
  ) {
    return await this.prisma.providerCredentials.upsert({
      where: {
        providerId: providerId,
      },
      update: {
        accessToken: encrypt(accessToken),
      },
      create: {
        userId: userId,
        providerId,
        provider,
        accessToken: encrypt(accessToken),
      },
    });
  }

  async addAction(action: Action) {
    return await this.prisma.action.create({
      data: {
        name: action.name,
        provider: action.provider,
        description: action.description || "",
      },
    });
  }
}
