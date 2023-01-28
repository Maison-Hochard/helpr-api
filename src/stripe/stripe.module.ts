import { Module } from "@nestjs/common";
import { MailingModule } from "../mailing/mailing.module";
import { UserService } from "../user/user.service";
import { PrismaService } from "../prisma.service";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";

@Module({
  imports: [MailingModule],
  controllers: [StripeController],
  providers: [StripeService, UserService, PrismaService],
  exports: [StripeService],
})
export class StripeModule {}
