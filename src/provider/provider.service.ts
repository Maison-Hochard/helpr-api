import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";

@Injectable()
export class ProviderService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async getCredentials(userId: number, provider: string | null) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
    if (!provider) {
      return await this.prisma.providerCredentials.findMany({
        where: {
          userId: user.id,
        },
      });
    } else {
      return await this.prisma.providerCredentials.findMany({
        where: {
          userId: user.id,
          provider: provider,
        },
      });
    }
  }
}
