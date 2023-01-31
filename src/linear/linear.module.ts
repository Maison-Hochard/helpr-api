import { Module } from "@nestjs/common";
import { MailingModule } from "../mailing/mailing.module";
import { UserService } from "../user/user.service";
import { PrismaService } from "../prisma.service";
import { LinearService } from "./linear.service";
import { LinearController } from "./linear.controller";
import { GithubService } from "../github/github.service";

@Module({
  imports: [MailingModule],
  controllers: [LinearController],
  providers: [LinearService, UserService, PrismaService, GithubService],
  exports: [LinearService],
})
export class LinearModule {}
