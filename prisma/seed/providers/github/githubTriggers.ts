import { prisma } from "../../../seed";

export async function issueCreatedTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      name: "issue-created",
      description: "Triggered when an issue is created",
      value: "issue-created",
      providerId: providerId,
      provider: "github",
      variables: {
        create: [
          {
            title: "Last Issue Title",
            name: "github_issue_title",
            value: "{last_github_issue_title}",
          },
          {
            title: "Last Issue Body",
            name: "github_issue_body",
            value: "{last_github_issue_body}",
          },
        ],
      },
    },
  });
}

export async function pullRequestCreatedTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      name: "pull-request-created",
      description: "Triggered when a pull request is created",
      value: "pull-request-created",
      providerId: providerId,
      provider: "github",
      variables: {
        create: [
          {
            title: "Last Pull Request Title",
            name: "github_pull_request_title",
            value: "{last_github_pull_request_title}",
          },
          {
            title: "Last Pull Request Body",
            name: "github_pull_request_body",
            value: "{last_github_pull_request_body}",
          },
        ],
      },
    },
  });
}
