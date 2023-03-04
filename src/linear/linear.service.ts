import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { ProviderCredentials } from "@prisma/client";
import { createIssueInput, createProjectInput } from "./linear.type";
import { FlowService } from "../flow/flow.service";
import { NgrokService } from "../ngrok";

@Injectable()
export class LinearService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
    private flowService: FlowService,
    private readonly ngrokService: NgrokService,
  ) {}

  async handleWebhook(body: any) {
    if (body.action === "create" && body.type === "Issue") {
      const user = await this.userService.getUserByProviderId(
        body.data.subscriberIds[0],
      );
      const linear_ticket_title = body.data.title;
      const linear_ticket_description = body.data.description;
      const linear_team_id = body.data.teamId;
      /*await this.flowService.addOrUpdateWebhookData({
        userId: user.id,
        provider: "linear",
        type: "linear_issue_created",
        data: JSON.stringify({
          linear_ticket_title,
          linear_ticket_description,
          linear_team_id,
        }),
      });*/
    }
    /*if (body.data) {
      const { title, number, labels, team } = body.data;
      const prefix = (
        labels && labels[0].name ? labels[0].name : "feature"
      ).toLowerCase();
      const teamName = (team && team.name ? team.name : title).toLowerCase();
      const branchName = `${prefix}/${teamName}-${number}`;
      console.log(branchName);
    }*/
  }

  checkIfWebhookExists(webhook, teamId: string, url: string) {
    return webhook.nodes.find((w) => {
      return w._team.id === teamId && w.url === url;
    });
  }

  async createWebhook(userId: number, name: string, where: string) {
    if (!where) throw new BadRequestException("team_id_required");
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linear",
      true,
    );
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/linear/webhook";
    const ngrokUrl = this.ngrokService.url + "/linear/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : ngrokUrl;
    const webhooks = await linearClient.webhooks();
    const webhookExist = await this.checkIfWebhookExists(
      webhooks,
      where,
      finalUrl,
    );
    if (webhookExist) {
      return {
        message: "webhook_already_exists",
      };
    }
    await linearClient.createWebhook({
      url: finalUrl,
      resourceTypes: ["Issue", "Project"],
      teamId: where,
      label: name,
    });
    return {
      message: "webhook_created",
    };
  }

  async createCredentials(
    userId: number,
    accessToken: string,
  ): Promise<ProviderCredentials> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("invalid_credentials");
    return await this.providerService.addCredentials(
      user.id,
      linearUser.id,
      "linear",
      accessToken,
    );
  }

  async createIssue(userId: number, createIssueInput: createIssueInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linear",
      true,
    );
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("invalid_credentials");
    const team = await linearClient.team(createIssueInput.linear_team_id);
    if (!team) throw new BadRequestException("team_not_found");
    await linearClient.createIssue({
      title: createIssueInput.linear_ticket_title,
      teamId: createIssueInput.linear_team_id,
      description: createIssueInput.linear_ticket_description || "",
      assigneeId: createIssueInput.linear_assignee_id || linearUser.id,
      labelIds: createIssueInput.linear_ticket_label_ids || [],
    });
    return {
      message: "issue_created",
      variables: {
        last_linear_ticket_title: createIssueInput.linear_ticket_title,
        last_linear_ticket_description:
          createIssueInput.linear_ticket_description,
      },
    };
  }

  async createProject(userId: number, createProjectInput: createProjectInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linear",
      true,
    );
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("invalid_credentials");
    const team = await linearClient.team(createProjectInput.linear_team_id);
    if (!team) throw new BadRequestException("team_not_found");
    await linearClient.createProject({
      name: createProjectInput.linear_project_title,
      teamIds: [createProjectInput.linear_team_id],
      description: createProjectInput.linear_project_description || "",
    });
    return {
      message: "project_created",
      variables: {
        last_linear_project_title: createProjectInput.linear_project_title,
        last_linear_project_description:
          createProjectInput.linear_project_description,
      },
    };
  }

  async getData(userId: number) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linear",
      true,
    );
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const linearUser = await linearClient.viewer;
    if (!linearUser) throw new BadRequestException("invalid_credentials");
    const teams = await linearUser.teams();
    const users = await linearClient.users();
    const labels = await linearClient.issueLabels();
    const states = await linearClient.workflowStates();
    return {
      linear_team_id: teams.nodes.map((team) => {
        return { name: team.name, value: team.id };
      }),
      linear_assignee_id: users.nodes.map((user) => {
        return { name: user.name, value: user.id };
      }),
      linear_ticket_labels_id: labels.nodes.map((label) => {
        return { name: label.name, value: label.id };
      }),
      linear_ticket_state_id: states.nodes.map((state) => {
        return { name: state.name, value: state.id };
      }),
    };
  }
}
