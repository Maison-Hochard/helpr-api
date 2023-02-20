import { prisma } from "../../../seed";
import {
  createCommentAction,
  createDatabaseAction,
  createItemInDatabaseAction,
} from "./notionActions";

export async function createNotionProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Notion",
      description:
        "Notion is a productivity tool that combines note-taking, wikis, and databases in one place.",
      logo: "https://storage.cloud.google.com/helpr/notion-logo-white.svg",
    },
  });
  // Actions
  await createItemInDatabaseAction(provider.id);
  await createDatabaseAction(provider.id);
  await createCommentAction(provider.id);
}
