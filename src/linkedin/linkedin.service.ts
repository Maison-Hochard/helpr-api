import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { ProviderCredentials } from "@prisma/client";
import { LinkedIn } from "linkedin-js";
import * as linkedinJs from "linkedin-js";

@Injectable()
export class LinkedinService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  /*  async handleWebhook(body: any) {
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
  }*/

  /* async createWebhook(userId: number) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linkedin",
      true,
    );
    const linkedin = new LinkedIn({
      apiKey: accessToken,
    });
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/linkedin/webhook";
    const webhookDevUrl =
      "https://eb3c-2a02-8440-5340-5e69-518c-252e-d6b3-5338.eu.ngrok.io/linkedin/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    await linkedin.createWebhook({
      url: finalUrl,
    });
    return {
      message: "webhook_created",
    };
  }
*/
  async postOnLinkedIn(userId: number, content: string) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "linkedin",
      true,
    );
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202211",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      };
      // Get user ID and cache it.
      const apiResp = await fetch("https://api.linkedin.com/v2/me", {
        headers: headers,
      });
      const profile = await apiResp.json();

      const params = {
        author: `urn:li:person:${profile.id}`,
        commentary: content,
        visibility: "PUBLIC",
        lifecycleState: "PUBLISHED",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
      };

      await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params),
      });
    } catch (error) {
      throw new BadRequestException("invalid_credentials");
    }
    return {
      message: "post-created",
    };
  }

  async createCredentials(
    userId: number,
    accessToken: string,
  ): Promise<ProviderCredentials> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("user_not_found");

    try {
      const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      console.log(data);

      return await this.providerService.addCredentials(
        user.id,
        data.id,
        "linkedin",
        accessToken,
      );
    } catch (error) {
      throw new BadRequestException("invalid_credentials");
    }
  }
}
