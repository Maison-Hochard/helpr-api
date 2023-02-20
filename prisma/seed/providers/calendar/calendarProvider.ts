import { prisma } from "../../../seed";
import { createEventAction, createCalendarAction } from "./calendarActions";

export async function createCalendarProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Google Calendar",
      description:
        "Create a new calendar or events in Google Calendar from Helpr",
      logo: "https://storage.cloud.google.com/helpr/calendar-logo-white.svg",
    },
  });
  // Action
  await createEventAction(provider.id);
  await createCalendarAction(provider.id);
}
