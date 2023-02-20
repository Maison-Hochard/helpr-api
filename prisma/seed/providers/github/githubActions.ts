import { prisma } from "../../../seed";

export async function createBranchAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Branch",
      description: "Create a branch on GitHub",
      endpoint: "github",
      name: "create-branch",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "New Branch Name",
            name: "github_branch_name",
            value: "{github_branch_name}",
          },
          {
            title: "From Branch",
            name: "github_from_branch",
            value: "{github_from_branch}",
          },
          {
            title: "Repository Name",
            name: "github_repository",
            value: "{github_repository}",
          },
        ],
      },
    },
  });
}

export async function createIssueAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Issue",
      description: "Create an issue on GitHub",
      endpoint: "github",
      name: "create-issue",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Issue Title",
            name: "github_issue_title",
            value: "{github_issue_title}",
          },
          {
            title: "Issue Body",
            name: "github_issue_body",
            value: "{github_issue_body}",
          },
          {
            title: "Repository Name",
            name: "github_repository",
            value: "{github_repository}",
          },
        ],
      },
    },
  });
}
