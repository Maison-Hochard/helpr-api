import { prisma } from "../../../seed";

export async function createTicketAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Ticket",
      description: "Create a ticket on Linear",
      endpoint: "linear",
      name: "create-ticket",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Ticket Title",
            name: "linear_ticket_title",
            value: "{linear_ticket_title}",
          },
          {
            title: "Ticket Description",
            name: "linear_ticket_description",
            value: "{linear_ticket_description}",
          },
          {
            title: "Ticket Assignee",
            name: "linear_ticket_assignee",
            value: "{linear_ticket_assignee}",
          },
        ],
      },
    },
  });
}

export async function createProjectAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Project",
      description: "Create a project on Linear",
      endpoint: "linear",
      name: "create-project",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Project Title",
            name: "linear_project_title",
            value: "{linear_project_title}",
          },
          {
            title: "Project Description",
            name: "linear_project_description",
            value: "{linear_project_description}",
          },
          {
            title: "Project Assignee",
            name: "linear_project_assignee",
            value: "{linear_project_assignee}",
          },
        ],
      },
    },
  });
}
