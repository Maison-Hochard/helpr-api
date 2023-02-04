import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { FlowService } from "./flow.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";
import { Body, Post } from "@nestjs/common";
import { createFlowInput, Trigger } from "./flow.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("flow")
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Get("/user/get-flows")
  async getFlows(@CurrentUser() user: JwtPayload) {
    return await this.flowService.getFlows(user.id);
  }

  @Get("get-flows")
  async getFlowsByTrigger(trigger: Trigger) {
    return await this.flowService.getFlowToRun(trigger);
  }

  @Post("add-flow")
  async addFlow(
    @CurrentUser() user: JwtPayload,
    @Body() flow: createFlowInput,
  ) {
    return await this.flowService.addFlow(user.id, flow);
  }
}
