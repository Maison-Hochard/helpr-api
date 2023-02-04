import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProviderService } from "../provider/provider.service";
import { FlowService } from "../flow/flow.service";
import { Status, Trigger } from "../flow/flow.type";

@Injectable()
export class CronService {
  constructor(
    private readonly providerService: ProviderService,
    private readonly flowService: FlowService,
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async runInstantFlow() {
    const flows = await this.flowService.getFlowsByTrigger(Trigger.INSTANT);
    for (const flow of flows) {
      console.log("running instant flow", flow.name + " " + flow.status);
      if (flow.status === Status.READY) {
        // await this.flowService.updateFlowStatus(flow.id, Status.RUNNING);
        for (const actions of flow.actions) {
          const provider = actions.action.provider;
          const endpoint = actions.action.name;
          const payload = {
            teamId: "34b08c67-0366-4cc0-8a32-07d481c045f1",
            userId: "c9b836b4-c359-4f6f-8fa5-a0cb00d579ff",
            title: "title " + new Date().toISOString(),
          };
          await fetch(`http://localhost:3000/${provider}/${endpoint}`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6MiwiZW1haWwiOiJocmljaGFyZDIwNkBpY2xvdWQuY29tIiwidXNlcm5hbWUiOiJIdWdvUkNEIiwiaWF0IjoxNjc1NDU2MTk4LCJleHAiOjE2NzU1NDI1OTh9.qejr3H3_EGM0Po3N729j1M48sEkfFCxQzt4nAxv8UHY",
            },
          });
        }
      }
    }
  }
}
