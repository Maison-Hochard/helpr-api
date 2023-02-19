import { prisma } from "../../../seed";

export async function ticketCreatedTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Create Ticket",
      name: "ticket-created",
      description: "Triggered when a ticket is created",
      value: "ticket-created",
      providerId: providerId,
      provider: "linear",
      variables: {
        create: [
          {
            title: "Last Ticket Title",
            name: "linear_ticket_title",
            value: "{last_linear_ticket_title}",
          },
          {
            title: "Last Ticket Description",
            name: "linear_ticket_description",
            value: "{last_linear_ticket_description}",
          },
        ],
      },
    },
  });
}

export async function projectCreatedTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Create Project",
      name: "project-created",
      description: "Triggered when a project is created",
      value: "project-created",
      providerId: providerId,
      provider: "linear",
      variables: {
        create: [
          {
            title: "Last Project Title",
            name: "linear_project_title",
            value: "{last_linear_project_title}",
          },
          {
            title: "Last Project Description",
            name: "linear_project_description",
            value: "{last_linear_project_description}",
          },
        ],
      },
    },
  });
}
