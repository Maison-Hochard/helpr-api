import { Action, Flow } from "@prisma/client";

type actionCreateInput = {
  id: number;
  name: string;
  payload: string;
};

export type createFlowInput = Flow & {
  actions: actionCreateInput[];
};

export type FlowWithActions = Flow & {
  actions: {
    action: Action & {
      payload: string;
    };
  }[];
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
