import { prisma } from "../../../seed";

export async function createCompletionAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Completion",
      description: "Create Completion with OpenAI",
      endpoint: "openai",
      name: "create-completion",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Completion Model",
            name: "create_completion_model",
            value: "{openai_completion_model}",
          },
          {
            title: "Create Completion Prompt",
            name: "create_completion_prompt",
            value: "{openai_completion_prompt}",
          },
          {
            title: "Create Completion Size",
            name: "create_completion_size",
            value: "{openai_completion_size}",
          },
        ],
      },
    },
  });
}
