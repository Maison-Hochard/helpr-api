import { prisma } from "../../../seed";

export async function postMessageAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Post Message",
      description: "Post a message to a channel in Slack",
      endpoint: "slack",
      name: "post-message",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Post Message Channel ID",
            name: "slack_message_channel",
            value: "{slack_message_channel}",
          },
          {
            title: "Post Message Text",
            name: "slack_message_text",
            value: "{slack_message_text}",
          },
        ],
      },
    },
  });
}

export async function createChannelAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Channel",
      description: "Create a channel in Slack",
      endpoint: "slack",
      name: "create-channel",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Channel Name",
            name: "slack_channel_name",
            value: "{slack_channel_name}",
          },
          {
            title: "Create Channel Privacy",
            name: "slack_channel_privacy",
            value: "{slack_channel_privacy}",
          },
        ],
      },
    },
  });
}
