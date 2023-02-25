import { prisma } from "../../../seed";
import { projectCreatedTrigger, ticketCreatedTrigger } from "./linearTriggers";
import { createProjectAction, createTicketAction } from "./linearActions";

export async function createLinearProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Linear",
      description: "Create tasks, issues, projects, and more in Linear",
      logo: "linear-logo",
    },
  });
  // Actions
  await createTicketAction(provider.id);
  await createProjectAction(provider.id);

  // Triggers
  await ticketCreatedTrigger(provider.id);
  await projectCreatedTrigger(provider.id);
}
