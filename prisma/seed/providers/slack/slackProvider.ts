import { prisma } from "../../../seed";
import { createChannelAction, postMessageAction } from "./slackActions";

export async function createSlackProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Slack",
      description:
        "Send messages, create channels, and more in Slack from Helpr",
      logo: "https://storage.cloud.google.com/helpr/slack-logo-white.svg",
    },
  });
  // Action
  await postMessageAction(provider.id);
  await createChannelAction(provider.id);
}
