import { Flow } from "@prisma/client";

type createActionInput = {
  id: number;
  name: string;
  payload: string;
};

export type createFlowInput = Flow & {
  actions: createActionInput[];
};

export type webhookDataInput = {
  userId: number;
  provider: string;
  type: string;
  data: string;
};

export enum Trigger {
  INSTANT = 1,
  EVERY_1_MINUTE = 2,
  EVERY_5_MINUTES = 3,
  EVERY_10_MINUTES = 4,
  EVERY_30_MINUTES = 5,
}

export enum Status {
  STANDBY = 1,
  READY = 2,
  RUNNING = 3,
}
