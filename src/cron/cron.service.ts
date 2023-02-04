import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProviderService } from "../provider/provider.service";
import { FlowService } from "../flow/flow.service";
import { Status, Trigger } from "../flow/flow.type";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CronService {
  constructor(
    private readonly providerService: ProviderService,
    private readonly flowService: FlowService,
    private readonly configService: ConfigService,
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async runInstantFlow() {
    const flows = await this.flowService.getFlowToRun(Trigger.INSTANT);
    if (flows.length === 0) {
      console.log("No flow to run");
    }
    for (const flow of flows) {
      if (flow.status === Status.READY) {
        console.log("Running flow: ", flow.name);
        await this.flowService.updateFlowStatus(flow.id, Status.RUNNING);
        for (const actions of flow.actions) {
          const provider = actions.action.provider;
          const endpoint = actions.action.name;
          const payload = JSON.parse(actions.payload);
          const apiUrl = this.configService.get("api_url");
          await fetch(`${apiUrl}/${provider}/${endpoint}`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6MSwiZW1haWwiOiJocmljaGFyZDIwNkBpY2xvdWQuY29tIiwidXNlcm5hbWUiOiJIdWdvUkNEIiwiaWF0IjoxNjc1NTIyNDEzLCJleHAiOjE2NzU2MDg4MTN9.BF-ee8fJilgSztsZiDuUcPsCTjuTqEJHO4PKTFkGCew",
            },
          });
        }
        await this.flowService.updateFlowStatus(flow.id, Status.STANDBY);
      }
    }
  }
}
