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
    const isFlowExist = await this.prisma.flow.findFirst({
      where: {
        name: flowData.name,
        userId: userId,
      },
    });
    if (isFlowExist) throw new BadRequestException("Flow already exist");
    const flow = await this.prisma.flow.create({
      data: {
        name: flowData.name,
        description: flowData.description,
        userId: userId,
        triggerId: trigger.id,
        status: Status.STANDBY,
        public: flowData.public,
        accessToken: accessToken,
        enabled: flowData.enabled,
      },
    });
    await this.prisma.flowActions.createMany({
      data: flowData.actions.map((action) => {
        return {
          actionId: action.id,
          flowId: flow.id,
          index: action.index,
          payload: JSON.stringify(action.payload),
        };
      }),
    });
    return {
      message: "flow_created",
      data: flow,
    };
  }

  async getUserFlows(userId: number, publicOnly = false) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");
    const flows = await this.prisma.flow.findMany({
      where: {
        userId: userId,
        public: publicOnly ? true : undefined,
      },
      include: {
        trigger: {
          include: {
            Provider: true,
          },
        },
        actions: {
          include: {
            action: {
              include: {
                provider: true,
                variables: true,
              },
            },
          },
        },
      },
    });
    const providers = flows.map((flow) => {
      const trigger = flow.trigger.Provider;
      const actions = flow.actions.map((action) => action.action.provider);
      return [trigger, ...actions];
    });
    const flowsData = flows.map((flow) => {
      return {
        id: flow.id,
        name: flow.name,
        description: flow.description,
        status: flow.status,
        enabled: flow.enabled,
        public: flow.public,
        trigger: flow.trigger,
        providers: providers[flows.indexOf(flow)],
        actions: flow.actions.map((action) => {
          return {
            id: action.id,
            index: action.index,
            action: action.action,
            payload: JSON.parse(action.payload),
          };
        }),
      };
    });
    return {
      message: "flows_found",
      data: flowsData,
    };
  }

  async getFlowById(flowId: number) {
    const flow = await this.prisma.flow.findUnique({
      where: {
        id: flowId,
      },
      include: {
        trigger: {
          include: {
            Provider: true,
          },
        },
        actions: {
          include: {
            action: {
              include: {
                provider: true,
                variables: true,
              },
            },
          },
        },
      },
    });
    if (!flow) throw new BadRequestException("flow_not_found");
    const providers = flow.actions.map((action) => action.action.provider);
    const flowData = {
      id: flow.id,
      name: flow.name,
      description: flow.description,
      status: flow.status,
      enabled: flow.enabled,
      public: flow.public,
      trigger: flow.trigger,
      providers: providers,
      actions: flow.actions.map((action) => {
        return {
          id: action.id,
          index: action.index,
          action: action.action,
          payload: JSON.parse(action.payload),
        };
      }),
    };
    return {
      message: "flow_found",
      data: flowData,
    };
  }

  async getFlowsToRun(trigger: Trigger) {
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
                    key: true,
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

  async updateFlowEnabled(userId: number, flowId: number, enabled: boolean) {
    const flow = await this.prisma.flow.findFirst({
      where: {
        id: flowId,
        userId: userId,
      },
    });
    if (!flow) throw new BadRequestException("flow_not_found");
    return await this.prisma.flow.update({
      where: {
        id: flowId,
      },
      data: {
        enabled: enabled,
      },
    });
  }

  async deleteFlow(userId: number, flowId: number) {
    const flow = await this.prisma.flow.findFirst({
      where: {
        id: flowId,
        userId: userId,
      },
    });
    if (!flow) throw new BadRequestException("flow_not_found");
    await this.prisma.flowActions.deleteMany({
      where: {
        flowId: flowId,
      },
    });
    await this.prisma.flow.delete({
      where: {
        id: flowId,
      },
    });
    return {
      message: "flow_deleted",
    };
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
