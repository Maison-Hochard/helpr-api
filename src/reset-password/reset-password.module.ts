import { Module } from "@nestjs/common";
import { ResetPasswordService } from "./reset-password.service";
import { ResetPasswordController } from "./reset-password.controller";
import { UserModule } from "../user/user.module";
import { MailingModule } from "../mailing/mailing.module";
import { PrismaService } from "../prisma.service";

@Module({
  imports: [UserModule, MailingModule],
  providers: [ResetPasswordService, PrismaService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
