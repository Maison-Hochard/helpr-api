import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import {
  webhookDataInput,
  createFlowInput,
  Status,
  Trigger,
} from "./flow.type";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class FlowService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService,
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
    const trigger = await this.prisma.trigger.findUnique({
      where: {
        id: flowData.triggerId,
      },
    });
    if (!trigger) throw new BadRequestException("trigger_not_found");
    const accessToken = await this.authService.createAccessToken(user);
    const flow = await this.prisma.flow.create({
      data: {
        name: flowData.name,
        description: flowData.description,
        userId: userId,
        triggerId: trigger.id,
        status: Status.STANDBY,
        accessToken: accessToken,
      },
    });
    await this.prisma.flowActions.createMany({
      data: flowData.actions.map((action) => {
        return {
          actionId: action.id,
          flowId: flow.id,
          payload: JSON.stringify(action.payload),
          order: action.order,
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
        trigger: true,
        actions: {
          include: {
            action: {
              include: {
                variables: true,
              },
            },
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
    const flows = await this.prisma.flow.findMany({
      where: {
        triggerId: trigger,
        status: Status.READY,
        enabled: true,
      },
      include: {
        trigger: {
          select: {
            value: true,
          },
        },
        actions: {
          include: {
            action: {
              include: {
                variables: {
                  select: {
                    name: true,
                    value: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return {
      message: "flows_found",
      data: flows,
    };
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

  /*async addOrUpdateWebhookData(addWebhookDataInput: webhookDataInput) {
    return await this.prisma.webhookData.upsert({
      where: {
        type: addWebhookDataInput.type,
      },
      create: {
        userId: addWebhookDataInput.userId,
        provider: addWebhookDataInput.provider,
        data: addWebhookDataInput.data,
        type: addWebhookDataInput.type,
      },
      update: {
        data: addWebhookDataInput.data,
      },
    });
  }*/

  /*async getWebhookData(userId: number, type: string) {
    const webhookData = await this.prisma.webhookData.findFirst({
      where: {
        userId: userId,
        type: type,
      },
    });
    return {
      message: "webhook_data_found",
      data: webhookData,
    };
  }*/
}
