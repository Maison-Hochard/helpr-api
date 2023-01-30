import { Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { LinearClient } from "@linear/sdk";
import { TeamResponse } from "./linear.type";

@Injectable()
export class LinearService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
  ) {}

  async getTeams(accessToken: string) {
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const graphQLClient = linearClient.client;
    const { data } = await graphQLClient.rawRequest(
      `query Teams {
       teams {
       nodes {
          id
          name
          projects {
            nodes {
              name
              id
            }
          }
          }
       }
    }`,
    );
    const teams = data as TeamResponse;
    return teams.teams.nodes;
  }

  async createWebhook(teamId: string, accessToken: string) {
    const linearClient = new LinearClient({
      apiKey: accessToken,
    });
    const graphQLClient = linearClient.client;
    await graphQLClient.rawRequest(
      `mutation CreateWebhook($input: WebhookCreateInput!) {
        webhookCreate(input: $input) {
          success
          webhook {
            id
            enabled
          }
        }
      }
    `,
      {
        input: {
          url: "https://8fca-78-126-205-77.eu.ngrok.io/linear/webhook",
          resourceTypes: ["Issue"],
          teamId: teamId,
        },
      },
    );
  }
}
