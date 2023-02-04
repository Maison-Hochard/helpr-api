import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { FlowService } from "../flow/flow.service";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";

@Module({
  imports: [],
  providers: [CronService, FlowService, PrismaService, UserService],
  exports: [CronService],
})
export class CronModule {}
