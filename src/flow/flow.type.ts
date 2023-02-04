import { Flow } from "@prisma/client";

export type createFlowInput = Flow & {
  actions: number[];
};
