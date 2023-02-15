import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { UserService } from "../../user/user.service";
import { ProviderService } from "../../provider/provider.service";
import { createDraftInput, createMailInput } from "./gmail.type";
import { google } from "googleapis";
import { PubSub } from "@google-cloud/pubsub";
import { timeout } from "cron";
import * as process from "process";

@Injectable()
export class GmailService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async handleWebhook() {
    const pubSubClient = new PubSub({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyTDgzEjItm8Y4\nqVGcUCiIKSu9w3pCQBjcTZrShcj2e4XJZO/9eJFiDwiUGdeCISs8cMjP2DbM5GeY\nPP4ApsMXSQOD7tYUoeDvMhwa7s7tqDcT1eJQTUJxK7TLfv7FXu449dyn5SgHhk6d\n0ZjGVKKcPSunCl7HotDd8VhNaV2NM70CTas9aj+pU/0uhgitJlU+hGK8GJrJCm2i\n/dWZ6SE/wO/P7RLYk2BsCdTyXOvVyQ69VMTgRBKeXhWXscCh1U8FcvhlCLvfvWf2\nSZkQZz3sHCNJ7EN2FrGvP9XHxVc7xAuQDS5GAJvdGJ+kxntKBrKiOwpyIN2012OQ\n9GgvuH6zAgMBAAECggEAAN0+YdOoa0YtBiCepPun0U55yCKxbgQc2ryEOpmsFAhx\n6TxUWXiDI+Q0w3BYoL3ZFXg/0O9tsefi2f8PBXZ0IvcXTZq+bj0r95zY5rHaTkFE\nJb7MqQem1yDsxcETf7tqZjDy5TFxfzqBw7a8tIFmhGFbhnoWDtuq2C3k+AMXEVR5\nHD+9FyX5Si05QhM9h2gXhI6tGAdxcxZJI8A6e/oSkF9zbI04LFmZhc5t92y/2MKJ\n7S6K8h7wtFFRz9gsetsC4wguGJcG7FGZ35x3IIRvidpeWCOBqxBvbdmfzZGrXn2n\nZn3NPMs5wVvFkpWi+1RAMrb56uwnKw4ZfHBgfhxWkQKBgQD4FOOWLZoVhIVORMGy\nql9poVNYA4rOgErh6J9A4wSOg9Y6ZeFbf81DejrH9e1HfpSRhzPYWR1a4sesPoRZ\nSbsGGCVyRHsu3uhckXxwy1QAzJdmC0CavbpVPDHhlReVuTRyhxMn2oryo6/8LWq9\nBEIOBV67JCb78auzpSGSZf3QywKBgQC3/R3Jq0ul291gO9VPT6QPWvQTjfJqWIq2\naPKsMCGnDy3CkyoGIeN+7yk5KHNz2KPz5oGGuKuPOypR2IRyEMosavcxKIMyvC3N\n+eJSMHmKQSvvEallpCFnO6y48dPzWF5CJuZdgv58biv8GBiq9YfHBko0hg/WCzcS\nEp2z0R5UuQKBgGgOUvut+wBlioiu3FQ1lDm5Oj0jlzhQpZgmO4466rFgaR4rl6AK\ndi2Eel1fMPyZAnYcMMnhbyetEbWUr2zIOVMwE5zfTo/1XZ9eQsUI9B41spdRxvJg\n/GQ+EGofYDoj6fTT5VwFFdz6fZmX7zqDK7W32OlEG7n3v15luDQw5YqLAoGADqkG\nhJk3j+GzBAYAey9XXTncFOrMlBi2BM7b90hmhg85kDV1tcNhgy2/VSSZ/nMWrUqC\nq59vXBxUxOzBsO0RjvR++dXGjnZcF/t/QxlFtfR3cbcwjj7DwpwIqTvrrYovCIpc\n9LqJWJTWwGGTJZwm0372zrSX8nA2VSRSmI9jIVECgYAbzMMHJIUjB7pPSogCA3Sf\nUrgXF2XtzatHAIXVmKPBU5XZMhYTPqsNepumTAPADzYKHwjEPX7iW3qRGlXzesJQ\n7QO+rkrkwE0n6YeUU9T0Uhn4PkyJA8aUR0hoacNpHO5Lb6MfBkxlDDv8TvZ/zM2Q\nLoQSaghxdaPqvH9iRrz6uA==\n-----END PRIVATE KEY-----\n",
      },
      projectId: process.env.GOOGLE_PROJECT_ID,
    });

    const subscription = pubSubClient.subscription(process.env.GOOGLE_SUB);
    const messageHandler = (message: any) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      message.ack();
    };
    subscription.on("message", messageHandler);
    setTimeout(() => {
      subscription.removeListener("message", messageHandler);
    }, 1000 * 60 * 5);
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
