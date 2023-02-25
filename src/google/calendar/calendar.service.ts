import { Injectable, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { UserService } from "../../user/user.service";
import { ProviderService } from "../../provider/provider.service";
import { createCalendarInput, createEventInput } from "./calendar.type";
import { google } from "googleapis";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { JwtPayload } from "../../auth/auth.service";

@Injectable()
export class CalendarService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async handleWebhook() {
    /*    const { accessToken } = await this.providerService.getCredentialsByProvider(
      3,
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
    // list the last event created
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: "startTime",
    });
    const lastEvent = res.data.items[0];
    console.log("Summary = " + lastEvent.summary);
    console.log("Description = " + lastEvent.description);
    console.log("Location = " + lastEvent.location);
    return {
      message: "webhook_handled",
      data: res.data,
    };*/
  }

  async createWebhook(userId: number): Promise<any> {
    /*    const { accessToken } = await this.providerService.getCredentialsByProvider(
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
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/calendar/webhook";
    const webhookDevUrl =
      "https://d258-78-126-205-77.eu.ngrok.io/calendar/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    const res = await calendar.events.watch({
      calendarId: "primary",
      requestBody: {
        id: userId.toString(),
        type: "web_hook",
        address: finalUrl,
      },
    });
    return {
      message: "webhook_created",
      data: res,
    };*/
  }

  async createCalendar(
    userId: number,
    createCalendarInput: createCalendarInput,
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
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const res = await calendar.calendars.insert({
      requestBody: {
        summary: createCalendarInput.calendar_calendar_summary,
        location: createCalendarInput.calendar_calendar_location,
        description: createCalendarInput.calendar_calendar_description,
        timeZone: createCalendarInput.calendar_calendar_timezone,
      },
    });
    return {
      message: "calendar_created",
      data: res.data,
    };
  }

  async createEvent(
    userId: number,
    createEventInput: createEventInput,
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
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = await calendar.events.insert({
      calendarId: createEventInput.calendar_event_calendar_id,
      resource: {
        summary: createEventInput.calendar_event_summary,
        location: createEventInput.calendar_event_location,
        description: createEventInput.calendar_event_description,
        start: {
          dateTime: createEventInput.calendar_event_start_date_time,
          timeZone: createEventInput.calendar_event_timezone,
        },
        end: {
          dateTime: createEventInput.calendar_event_end_date_time,
          timeZone: createEventInput.calendar_event_timezone,
        },
      },
    });
    return {
      message: "event_created",
      data: res,
    };
  }
}
