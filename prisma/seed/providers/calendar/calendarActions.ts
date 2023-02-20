import { prisma } from "../../../seed";

export async function createEventAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Event",
      description: "Create an event in Google Calendar",
      endpoint: "calendar",
      name: "create-event",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Event Calendar ID",
            name: "calendar_event_calendar_id",
            value: "{calendar_event_calendar_id}",
          },
          {
            title: "Create Event Summary",
            name: "calendar_event_summary",
            value: "{calendar_event_summary}",
          },
          {
            title: "Create Event Location",
            name: "calendar_event_location",
            value: "{calendar_event_location}",
          },
          {
            title: "Create Event Description",
            name: "calendar_event_description",
            value: "{calendar_event_description}",
          },
          {
            title: "Create Event End Date Time",
            name: "calendar_event_end_date_time",
            value: "{calendar_event_end_date_time}",
          },
          {
            title: "Create Event Time Zone",
            name: "calendar_event_timezone",
            value: "{calendar_event_timezone}",
          },
          {
            title: "Create Event Start Date Time",
            name: "calendar_event_start_date_time",
            value: "{calendar_event_start_date_time}",
          },
        ],
      },
    },
  });
}

export async function createCalendarAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Calendar",
      description: "Create a new calendar in Google Calendar",
      endpoint: "calendar",
      name: "create-calendar",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Calendar Summary",
            name: "calendar_calendar_summary",
            value: "{calendar_calendar_summary}",
          },
          {
            title: "Create Calendar Location",
            name: "calendar_calendar_location",
            value: "{calendar_calendar_location}",
          },
          {
            title: "Create Calendar Description",
            name: "calendar_calendar_description",
            value: "{calendar_calendar_description}",
          },
          {
            title: "Create Calendar Time Zone",
            name: "calendar_calendar_timezone",
            value: "{calendar_calendar_timezone}",
          },
        ],
      },
    },
  });
}
