import { prisma } from "../../../seed";
import { createPostAction } from "./linkedinActions";

export async function createLinkedinProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Linkedin",
      description:
        "The world's largest professional network with 760 million members available in Helpr",
      logo: "https://storage.cloud.google.com/helpr/linkedin-logo-white.svg",
    },
  });
  // Action
  await createPostAction(provider.id);
}
