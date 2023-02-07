import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { createIssueInput } from "./stripe.type";
import { Stripe } from "stripe";

@Injectable()
export class StripeService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}
  /*
  async handleWebhook(body: any) {
    console.log(body);
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

  async createWebhook(userId: number, teamId: string) {
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
    const webhookDevUrl =
      "https://765d-78-126-205-77.eu.ngrok.io/linear/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    await linearClient.createWebhook({
      url: finalUrl,
      resourceTypes: ["Issue", "Project"],
      teamId: teamId,
    });
    return {
      message: "webhook_created",
    };
  }*/

  async createCredentials(userId: number, accessToken: string) {
    const stripe = new Stripe(accessToken, {
      apiVersion: "2022-11-15",
    });
    const { id } = await stripe.accounts.retrieve();
    if (!id) throw new BadRequestException("invalid_credentials");
    return await this.providerService.addCredentials(
      userId,
      id.toString(),
      "stripe",
      accessToken,
    );
  }

  async createIssue(userId: number, createIssueInput: createIssueInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "stripe",
      true,
    );
    const stripeClient = new LinearClient({
      apiKey: accessToken,
    });
    return {
      message: "issue_created",
    };
  }
}
