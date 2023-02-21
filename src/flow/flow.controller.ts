import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from "@nestjs/common";
import { FlowService } from "./flow.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";
import { Body, Post } from "@nestjs/common";
import { createFlowInput, Trigger } from "./flow.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("flow")
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Get()
  async getFlows(@CurrentUser() user: JwtPayload) {
    return await this.flowService.getUserFlows(user.id);
  }

  @Get("get-flows")
  async getFlowsByTrigger(trigger: Trigger) {
    return await this.flowService.getFlowToRun(trigger);
  }

  @Post()
  async addFlow(
    @CurrentUser() user: JwtPayload,
    @Body() flow: createFlowInput,
  ) {
    return await this.flowService.addFlow(user.id, flow);
  }

  @Put(":id/status")
  async updateFlowEnabled(
    @CurrentUser() user: JwtPayload,
    @Param("id", ParseIntPipe) id: number,
    @Body("enabled") enabled: boolean,
  ) {
    return await this.flowService.updateFlowEnabled(user.id, id, enabled);
  }

  @Delete(":id")
  async deleteFlow(
    @CurrentUser() user: JwtPayload,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return await this.flowService.deleteFlow(user.id, id);
  }
}
