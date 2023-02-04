import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { createFlowInput } from "./flow.type";

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
          in: flowData.actions.map((action) => action),
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
      },
    });
    await this.prisma.flowAction.createMany({
      data: flowData.actions.map((action) => {
        return {
          actionId: action,
          flowId: flow.id,
        };
      }),
    });
    return {
      message: "flow_created",
      data: flow,
    };
  }

  async getFlows(userId: number) {
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
}
