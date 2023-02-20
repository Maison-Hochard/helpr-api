import { prisma } from "../../../seed";
import { createDraftAction, sendMailAction } from "./gmailActions";

export async function createGmailProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Gmail",
      description:
        "Gmail is an email service developed by Google. You can use Gmail from Helpr to create drafts and send emails.",
      logo: "https://storage.cloud.google.com/helpr/gmail-logo-white.svg",
    },
  });
  // Action
  await createDraftAction(provider.id);
  await sendMailAction(provider.id);
}
