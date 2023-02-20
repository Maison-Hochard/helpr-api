import { prisma } from "../../../seed";
import { createCompletionAction } from "./openaiActions";

export async function createOpenaiProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "OpenAI",
      description:
        "OpenAI is an artificial intelligence which can be used to generate text. This service is available in Helpr.",
      logo: "https://storage.cloud.google.com/helpr/openai-logo-white.svg",
    },
  });
  // Action
  await createCompletionAction(provider.id);
}
