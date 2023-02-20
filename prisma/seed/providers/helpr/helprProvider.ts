import { prisma } from "../../../seed";
import {
  every10MinutesTrigger,
  every30MinutesTrigger,
  everyHourTrigger,
} from "./helprTriggers";

export async function createHelprProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Helpr",
      description:
        "Helpr provide many default triggers like every 5 minutes, every 10 minutes, etc...",
      logo: "https://storage.cloud.google.com/helpr/helpr-logo-white.svg",
    },
  });
  // Triggers
  await every10MinutesTrigger(provider.id);
  await every30MinutesTrigger(provider.id);
  await everyHourTrigger(provider.id);
}
