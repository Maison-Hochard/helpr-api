import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { Client } from "@notionhq/client";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { ProviderCredentials } from "@prisma/client";
import {
  createItemInDatabaseInput,
  createDatabaseInput,
  createComment,
} from "./notion.type";

@Injectable()
export class NotionService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async handleWebhook(body: any) {
    if (body.data) {
      const { title, number, labels, team } = body.data;
      const prefix = (
        labels && labels[0].name ? labels[0].name : "feature"
      ).toLowerCase();
      const teamName = (team && team.name ? team.name : title).toLowerCase();
      const branchName = `${prefix}/${teamName}-${number}`;
      console.log(branchName);
    }
  }

  /*  async createWebhook(userId: number, teamId: string) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "notion",
      true,
    );
    const notionClient = new Client({
      auth: accessToken,
    });
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/notion/webhook";
    const webhookDevUrl =
      "https://eb3c-2a02-8440-5340-5e69-518c-252e-d6b3-5338.eu.ngrok.io/notion/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    console.log(finalUrl);
    const response = await notionClient.createWebhook({
      url: finalUrl,
      resourceTypes: ["Issue"],
      teamId: teamId,
    });
    return {
      message: "webhook_created",
      data: response,
    };
  }*/

  async createCredentials(
    userId: number,
    accessToken: string,
  ): Promise<ProviderCredentials> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");
    const notionClient = new Client({
      auth: accessToken,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const notionUser = await notionClient.users.me();
    if (!notionUser) throw new BadRequestException("invalid_credentials");
    return await this.providerService.addCredentials(
      user.id,
      notionUser.id,
      "notion",
      accessToken,
    );
  }

  async createComment(userId: number, createComment: createComment) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "notion",
      true,
    );
    const notionClient = new Client({
      auth: accessToken,
    });
    await notionClient.comments.create({
      parent: {
        type: "page_id",
        page_id: createComment.pageId,
      },
      rich_text: [
        {
          type: "text",
          text: {
            content: createComment.text,
          },
        },
      ],
    });
    return {
      message: "comment_created",
    };
  }

  async createDatabase(
    userId: number,
    createDatabaseInput: createDatabaseInput,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "notion",
      true,
    );
    const notionClient = new Client({
      auth: accessToken,
    });
    await notionClient.databases.create({
      parent: {
        type: "page_id",
        page_id: createDatabaseInput.pageId,
      },
      title: [
        {
          type: "text",
          text: {
            content: createDatabaseInput.title,
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Description: {
          rich_text: {},
        },
      },
    });
    return {
      message: "database_created",
    };
  }

  async createItemInDatabase(
    userId: number,
    createItemInDatabaseInput: createItemInDatabaseInput,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "notion",
      true,
    );
    const notionClient = new Client({
      auth: accessToken,
    });
    await notionClient.pages.create({
      parent: {
        database_id: createItemInDatabaseInput.databaseId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: createItemInDatabaseInput.title,
              },
            },
          ],
        },
      },
    });
    return {
      message: "item_created",
    };
  }
}
