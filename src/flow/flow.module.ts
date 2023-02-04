import { Module } from "@nestjs/common";
import { FlowService } from "./flow.service";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { FlowController } from "./flow.controller";

@Module({
  imports: [],
  controllers: [FlowController],
  providers: [FlowService, UserService, PrismaService, ProviderService],
  exports: [FlowService],
})
export class FlowModule {}
