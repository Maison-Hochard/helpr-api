import { prisma } from "../../../seed";

export async function sendMailAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Send Mail",
      description: "Send a mail in Gmail",
      endpoint: "gmail",
      name: "send-mail",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Send Mail To",
            name: "gmail_mail_to",
            value: "{gmail_mail_to}",
          },
          {
            title: "Send Mail Subject",
            name: "gmail_mail_subject",
            value: "{gmail_mail_subject}",
          },
          {
            title: "Send Mail Body",
            name: "gmail_mail_body",
            value: "{gmail_mail_body}",
          },
        ],
      },
    },
  });
}

export async function createDraftAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Draft",
      description: "Create a draft in Gmail",
      endpoint: "gmail",
      name: "create-draft",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Send Draft To",
            name: "gmail_draft_to",
            value: "{gmail_draft_to}",
          },
          {
            title: "Send Draft Subject",
            name: "gmail_draft_subject",
            value: "{gmail_draft_subject}",
          },
          {
            title: "Send Draft Body",
            name: "gmail_draft_body",
            value: "{gmail_draft_body}",
          },
        ],
      },
    },
  });
}
