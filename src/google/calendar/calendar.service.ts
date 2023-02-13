import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { UserService } from "../../user/user.service";
import { ProviderService } from "../../provider/provider.service";
import { createCalendarInput, createEventInput } from "./calendar.type";
import { google } from "googleapis";

@Injectable()
export class CalendarService {
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

  async createCalendar(
    userId: number,
    createCalendarInput: createCalendarInput,
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
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const res = await calendar.calendars.insert({
      requestBody: {
        summary: createCalendarInput.summary,
        location: createCalendarInput.location,
        description: createCalendarInput.description,
        timeZone: createCalendarInput.timeZone,
      },
    });
    return {
      message: "calendar_created",
      data: res.data,
    };
  }

  async createEvent(userId: number, createEventInput: createEventInput) {
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
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = await calendar.events.insert({
      calendarId: createEventInput.calendarId,
      resource: {
        summary: createEventInput.summary,
        location: createEventInput.location,
        description: createEventInput.description,
        start: {
          dateTime: createEventInput.startDateTime,
          timeZone: createEventInput.timeZone,
        },
        end: {
          dateTime: createEventInput.endDateTime,
          timeZone: createEventInput.timeZone,
        },
      },
    });
    return {
      message: "event_created",
      data: res,
    };
  }
}
