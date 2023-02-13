import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { UserService } from "../../user/user.service";
import { ProviderService } from "../../provider/provider.service";
import { createSheetInput, updateSheetTitleInput } from "./sheet.type";
import { google } from "googleapis";

@Injectable()
export class SheetService {
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
  }

  async createWebhook(userId: number, teamId: string) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "sheet",
      true,
    );
    const sheetClient = new LinearClient({
      apiKey: accessToken,
    });
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/sheet/webhook";
    const webhookDevUrl =
      "https://765d-78-126-205-77.eu.ngrok.io/sheet/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    await sheetClient.createWebhook({
      url: finalUrl,
      resourceTypes: ["Issue", "Project"],
      teamId: teamId,
    });
    return {
      message: "webhook_created",
    };
  }*/

  async createSheet(userId: number, createSheetInput: createSheetInput) {
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
    const spreadsheetBody = {
      properties: {
        title: createSheetInput.title,
      },
    };
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const res = await sheets.spreadsheets.create({
      requestBody: spreadsheetBody,
    });
    return {
      message: "sheet_created",
      data: res,
    };
  }

  async updateSheet(
    userId: number,
    updateSheetTitleInput: updateSheetTitleInput,
  ) {
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
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const idSheet = await sheets.spreadsheets.get({
      spreadsheetId: updateSheetTitleInput.sheetId,
    });
    if (!idSheet) {
      throw new BadRequestException("sheet_not_found");
    }
    const res = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: updateSheetTitleInput.sheetId,
      requestBody: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                title: updateSheetTitleInput.title,
              },
              fields: "title",
            },
          },
        ],
      },
    });
    return {
      message: "sheet_updated",
      data: res,
    };
  }
}
