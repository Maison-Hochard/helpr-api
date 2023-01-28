import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MailingModule } from "../mailing/mailing.module";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { PrismaService } from "../prisma.service";

@Module({
  imports: [MailingModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, PrismaService],
  exports: [UserService],
})
export class UserModule {}
