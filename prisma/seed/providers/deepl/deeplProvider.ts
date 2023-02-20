import { prisma } from "../../../seed";
import { translateTextAction } from "./deeplActions";

export async function createDeeplProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "DeepL",
      description:
        "DeepL is the most accurate translation service available in Helpr.",
      logo: "https://storage.cloud.google.com/helpr/deepl-logo-white.svg",
    },
  });
  // Action
  await translateTextAction(provider.id);
}
