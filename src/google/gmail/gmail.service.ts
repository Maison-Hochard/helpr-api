import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { UserService } from "../../user/user.service";
import { ProviderService } from "../../provider/provider.service";
import { createDraftInput, createMailInput } from "./gmail.type";
import { google } from "googleapis";

@Injectable()
export class GmailService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async handleWebhook(body: any) {
    console.log(body);
  }

  async createWebhook(userId: number): Promise<any> {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "google",
      true,
    );
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get("google.client_id"),
      this.configService.get("google.client_secret"),
      this.configService.get("google.callback_url"),
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    /*    const env = this.configService.get("env");
    const webhookProdUrl = this.configService.get("api_url") + "/gmail/webhook";
    const webhookDevUrl = "https://6fd2-163-5-23-73.eu.ngrok.io/gmail/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;*/
    const res = await gmail.users.watch({
      userId: "me",
      requestBody: {
        labelIds: ["INBOX", "DRAFT", "SENT"],
        topicName: "projects/helpr-375013/topics/helprtopic",
      },
    });
    return {
      message: "webhook_created",
      data: res,
    };
  }

  async createDrafts(
    userId: number,
    createDraftInput: createDraftInput,
  ): Promise<any> {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "google",
      true,
    );
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get("google.client_id"),
      this.configService.get("google.client_secret"),
      this.configService.get("google.callback_url"),
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const message = btoa(
      "To: " +
        createDraftInput.to +
        "\r\n" +
        "Subject: " +
        createDraftInput.subject +
        "\r\n\r\n" +
        createDraftInput.body,
    );
    const res = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        id: "me",
        message: {
          raw: message,
        },
      },
    });
    return {
      message: "draft_created",
      data: res,
    };
  }

  async sendMail(
    userId: number,
    createMailInput: createMailInput,
  ): Promise<any> {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "google",
      true,
    );
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get("google.client_id"),
      this.configService.get("google.client_secret"),
      this.configService.get("google.callback_url"),
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const message = btoa(
      "To: " +
        createMailInput.to +
        "\r\n" +
        "Subject: " +
        createMailInput.subject +
        "\r\n\r\n" +
        createMailInput.body,
    );
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: message,
      },
    });
    return {
      message: "send_mail",
      data: res,
    };
  }
}
