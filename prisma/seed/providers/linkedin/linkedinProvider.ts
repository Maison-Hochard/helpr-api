import { prisma } from "../../../seed";
import { createPostAction } from "./linkedinActions";

export async function createLinkedinProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Linkedin",
      description:
        "Linkeding is the world's largest professional network. You can post from Helpr",
      logo: "https://storage.cloud.google.com/helpr/linkedin-logo-white.svg",
    },
  });
  // Action
  await createPostAction(provider.id);
}
