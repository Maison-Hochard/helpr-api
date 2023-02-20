import { prisma } from "../../../seed";

export async function every10MinutesTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Every 10 minutes",
      name: "every10Minutes",
      description: "Trigger every 10 minutes",
      value: "every_10_minutes",
      providerId: providerId,
      provider: "helpr",
    },
  });
}

export async function every30MinutesTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Every 30 minutes",
      name: "every30Minutes",
      description: "Trigger every 30 minutes",
      value: "every_30_minutes",
      providerId: providerId,
      provider: "helpr",
    },
  });
}

export async function everyHourTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Every hour",
      name: "everyHour",
      description: "Trigger every hour",
      value: "every_hour",
      providerId: providerId,
      provider: "helpr",
    },
  });
}
