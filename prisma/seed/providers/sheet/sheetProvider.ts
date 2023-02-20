import { prisma } from "../../../seed";
import { createSheetAction, updateSheetAction } from "./sheetActions";

export async function createSheetProvider() {
  const provider = await prisma.provider.create({
    data: {
      name: "Google Sheet",
      description: "Create or update a sheet from Helpr",
      logo: "https://storage.cloud.google.com/helpr/sheet-logo-white.svg",
    },
  });
  // Action
  await createSheetAction(provider.id);
  await updateSheetAction(provider.id);
}
