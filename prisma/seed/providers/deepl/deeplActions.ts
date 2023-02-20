import { prisma } from "../../../seed";

export async function translateTextAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Translate text",
      description: "Translate text from one language to another",
      endpoint: "deepl",
      name: "translate",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Deepl Text",
            name: "deepl_text",
            value: "{deepl_text}",
          },
          {
            title: "Deepl Source Language",
            name: "deepl_source_lang",
            value: "{deepl_source_lang}",
          },
          {
            title: "Deepl Target Language",
            name: "deepl_target_lang",
            value: "{deepl_target_lang}",
          },
        ],
      },
    },
  });
}
