import { PrismaClient } from "@prisma/client";
import { createLinearProvider } from "./seed/providers/linear/linearProvider";
import { createGithubProvider } from "./seed/providers/github/githubProvider";
import { createHelprProvider } from "./seed/providers/helpr/helprProvider";

export const prisma = new PrismaClient();

async function main() {
  try {
    await createLinearProvider();
    await createGithubProvider();
    await createHelprProvider();
  } catch (e) {
    console.error(e);
  }
  /*await prisma.provider.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Helpr",
        description: "Helpr provide many triggers to start your flow",
        logo: "https://storage.cloud.google.com/helpr/helpr-logo-white.svg",
      },
      {
        name: "Linear",
        description:
          "Create tasks, issues, projects, and more in Linear from Helpr",
        logo: "https://storage.cloud.google.com/helpr/linear-logo-white.svg",
      },
      {
        name: "Github",
        description: "Create branches, issues, and more in Github from Helpr",
        logo: "https://storage.cloud.google.com/helpr/github-logo-white.svg",
      },
      {
        name: "Slack",
        description:
          "Send messages, create channels, and more in Slack from Helpr",
        logo: "https://storage.cloud.google.com/helpr/slack-logo-white.svg",
      },
      {
        name: "OpenAI",
        description: "Generate text with the power GPT-3 from Helpr",
        logo: "https://storage.cloud.google.com/helpr/openai-logo-white.svg",
      },
      {
        name: "Google",
        description:
          "Create mail, calendar events, and more in Google from Helpr",
        logo: "https://storage.cloud.google.com/helpr/google-logo-white.svg",
      },
      {
        name: "Notion",
        description: "Create pages, databases, and more in Notion from Helpr",
        logo: "https://storage.cloud.google.com/helpr/notion-logo-white.svg",
      },
      {
        name: "DeepL",
        description: "Translate text with the power of DeepL from Helpr",
        logo: "https://storage.cloud.google.com/helpr/deepl-logo-white.svg",
      },
    ],
  });
  await prisma.trigger.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Every 10 minutes",
        description: "Trigger your flow every 10 minutes",
        value: "every_10_minutes",
        provider: "helpr",
        providerId: 1,
      },
      {
        name: "Every 30 minutes",
        description: "Trigger your flow every 30 minutes",
        value: "every_30_minutes",
        provider: "helpr",
        providerId: 1,
      },
      {
        name: "Every 1 hour",
        description: "Trigger your flow every 1 hour",
        value: "every_1_hour",
        provider: "helpr",
        providerId: 1,
      },
      {
        name: "When a new issue is created",
        description: "Trigger your flow when a new issue is created",
        value: "github_issue_created",
        provider: "github",
        providerId: 2,
      },
      {
        name: "When a new ticket is created",
        description: "Trigger your flow when a new ticket is created",
        value: "linear_ticket_created",
        provider: "linear",
        providerId: 2,
      },
    ],
  });
  await prisma.action.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Create Ticket",
        description: "Create a ticket on Linear",
        endpoint: "linear",
        name: "create-ticket",
        providerId: 2,
      },
      {
        title: "Create a new issue in Github",
        description: "Create a new issue in Github...",
        endpoint: "github",
        name: "create-issue",
        providerId: 3,
      },
      {
        title: "Create a new branch in Github",
        description: "Create a new branch in Github...",
        endpoint: "github",
        name: "create-branch",
        providerId: 3,
      },
    ],
  });
  await prisma.provider.create({
    data: {
      name: "Helpr",
      description: "Helpr provide many triggers to start your flow",
      logo: "https://storage.cloud.google.com/helpr/helpr-logo-white.svg",
    },
  });
  await prisma.variables.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Repository",
        name: "repository",
        value: "{github_repository}",
      },
      {
        title: "Issue Title",
        name: "title",
        value: "{github_issue_title}",
      },
      {
        title: "Issue Body",
        name: "body",
        value: "{github_issue_body}",
      },
      {
        title: "Ticket Title",
        name: "title",
        value: "{linear_ticket_title}",
      },
      {
        title: "Ticket Description",
        name: "description",
        value: "{linear_ticket_description}",
      },
    ],
  });*/
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
