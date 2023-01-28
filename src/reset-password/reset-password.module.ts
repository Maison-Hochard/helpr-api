import { Module } from "@nestjs/common";
import { ResetPasswordService } from "./reset-password.service";
import { ResetPasswordController } from "./reset-password.controller";
import { UserModule } from "../user/user.module";
import { MailingModule } from "../mailing/mailing.module";

@Module({
  imports: [UserModule, MailingModule],
  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
