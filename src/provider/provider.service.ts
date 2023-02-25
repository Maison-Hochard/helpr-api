import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { decrypt, encrypt } from "../utils";
import {
  createActionInput,
  createProviderInput,
  createTriggerInput,
} from "./provider.type";

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
        actions: {
          include: {
            variables: true,
          },
        },
        triggers: {
          include: {
            variables: true,
          },
        },
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
        userId,
        providerId,
        provider,
        accessToken: encrypt(accessToken),
      },
    });
  }

  async createOrUpdateAction(createActionInput: createActionInput) {
    return await this.prisma.action.upsert({
      where: {
        name: createActionInput.name,
      },
      update: {
        title: createActionInput.title,
        description: createActionInput.description,
        endpoint: createActionInput.endpoint,
        name: createActionInput.name,
        providerId: createActionInput.providerId,
      },
      create: {
        title: createActionInput.title,
        description: createActionInput.description,
        endpoint: createActionInput.endpoint,
        name: createActionInput.name,
        providerId: createActionInput.providerId,
      },
    });
  }

  async createOrUpdateTrigger(createTriggerInput: createTriggerInput) {
    return await this.prisma.trigger.upsert({
      where: {
        key: createTriggerInput.key,
      },
      update: {
        key: createTriggerInput.key,
        description: createTriggerInput.description,
        value: createTriggerInput.value,
        provider: createTriggerInput.provider,
        providerId: createTriggerInput.providerId,
      },
      create: {
        title: createTriggerInput.title,
        key: createTriggerInput.key,
        description: createTriggerInput.description,
        value: createTriggerInput.value,
        provider: createTriggerInput.provider,
        providerId: createTriggerInput.providerId,
      },
    });
  }

  async createOrUpdateProvider(createProviderInput: createProviderInput) {
    return await this.prisma.provider.upsert({
      where: {
        name: createProviderInput.name,
      },
      update: {
        name: createProviderInput.name,
        description: createProviderInput.description,
        logo: createProviderInput.logo,
      },
      create: {
        name: createProviderInput.name,
        description: createProviderInput.description,
        logo: createProviderInput.logo,
      },
    });
  }

  async getAvailableActions() {
    return await this.prisma.action.findMany({
      include: {
        variables: true,
      },
    });
  }

  async getAvailableTriggers() {
    return await this.prisma.trigger.findMany();
  }

  async getUserProviders(userId: number) {
    const providersCredentials = await this.prisma.providerCredentials.findMany(
      {
        where: {
          userId,
        },
      },
    );
    const defaultProviders = await this.prisma.provider.findMany({
      where: {
        name: {
          in: ["Helpr", "DeepL", "OpenAI"],
        },
      },
      include: {
        actions: {
          include: {
            variables: true,
          },
        },
        triggers: {
          include: {
            variables: true,
          },
        },
      },
    });
    const providers = await this.prisma.provider.findMany({
      where: {
        name: {
          in: providersCredentials.map(
            (provider) =>
              provider.provider.charAt(0).toUpperCase() +
              provider.provider.slice(1),
          ),
        },
      },
      include: {
        actions: {
          include: {
            variables: true,
          },
        },
        triggers: {
          include: {
            variables: true,
          },
        },
      },
    });
    return [...providers, ...defaultProviders];
  }
}
