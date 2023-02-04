import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { createFlowInput, Status, Trigger } from "./flow.type";

@Injectable()
export class FlowService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async addFlow(userId: number, flowData: createFlowInput) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");
    const actions = await this.prisma.action.findMany({
      where: {
        id: {
          in: flowData.actions.map((action) => action.id),
        },
      },
    });
    if (actions.length !== flowData.actions.length) {
      throw new BadRequestException("actions_not_found");
    }
    const flow = await this.prisma.flow.create({
      data: {
        name: flowData.name,
        description: flowData.description,
        userId: userId,
        trigger: flowData.trigger ? flowData.trigger : Trigger.EVERY_10_MINUTES,
        status: Status.STANDBY,
      },
    });
    await this.prisma.flowAction.createMany({
      data: flowData.actions.map((action) => {
        return {
          actionId: action.id,
          flowId: flow.id,
          payload: JSON.stringify(action.payload),
        };
      }),
    });
    return {
      message: "flow_created",
      data: flow,
    };
  }

  async getUserFlows(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");
    const flows = await this.prisma.flow.findMany({
      where: {
        userId: userId,
      },
      include: {
        actions: {
          include: {
            action: true,
          },
        },
      },
    });
    return {
      message: "flows_found",
      data: flows,
    };
  }

  async getFlowToRun(trigger: Trigger) {
    return await this.prisma.flow.findMany({
      where: {
        trigger: trigger,
        status: Status.READY,
        enabled: true,
      },
      include: {
        actions: {
          include: {
            action: true,
          },
        },
      },
    });
  }

  async updateFlowStatus(flowId: number, status: Status) {
    return await this.prisma.flow.update({
      where: {
        id: flowId,
      },
      data: {
        status: status,
      },
    });
  }
}
