import { prisma } from "../../../seed";
import { createBranchAction, createIssueAction } from "./githubActions";
import {
  issueCreatedTrigger,
  pullRequestCreatedTrigger,
} from "./githubTriggers";

export async function createGithubProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Github",
      description:
        "Create tasks, issues, projects, and more in Github from Helpr",
      logo: "https://storage.cloud.google.com/helpr/github-logo-white.svg",
    },
  });
  // Actions
  await createBranchAction(provider.id);
  await createIssueAction(provider.id);

  // Triggers
  await issueCreatedTrigger(provider.id);
  await pullRequestCreatedTrigger(provider.id);
}
