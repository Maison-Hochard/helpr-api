import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { decrypt, encrypt } from "../utils";
import { createActionInput, createProviderInput } from "./provider.type";

@Injectable()
export class ProviderService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async getProviders() {
    return await this.prisma.provider.findMany({
      include: {
        actions: true,
      },
    });
  }

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

  async addAction(createActionInput: createActionInput) {
    const action = await this.prisma.action.create({
      data: {
        title: createActionInput.title,
        description: createActionInput.description,
        endpoint: createActionInput.endpoint,
        name: createActionInput.name,
        providerId: createActionInput.providerId,
      },
    });
    return {
      message: "action_created",
      data: action,
    };
  }

  async addProvider(createProviderInput: createProviderInput) {
    const provider = await this.prisma.provider.create({
      data: {
        name: createProviderInput.name,
        description: createProviderInput.description,
        logo: createProviderInput.logo,
      },
    });
    return {
      message: "provider_created",
      data: provider,
    };
  }

  async getAvailableActions() {
    return await this.prisma.action.findMany();
  }

  async getUsersServices(userId: number) {
    const services = await this.prisma.providerCredentials.findMany({
      where: {
        userId,
      },
    });
    return {
      message: "services_found",
      data: services,
    };
  }
}
