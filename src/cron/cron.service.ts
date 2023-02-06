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

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async runInstantFlow() {
    const flowsResponse = await this.flowService.getFlowToRun(Trigger.INSTANT);
    console.log("Running instant flow", flowsResponse);
    if (flowsResponse.data.length === 0) {
      console.log("No flow to run");
    }
    for (const flow of flowsResponse.data) {
      if (flow.status === Status.READY) {
        console.log("Running flow: ", flow.name);
        await this.flowService.updateFlowStatus(flow.id, Status.RUNNING);
        const accessToken = flow.accessToken;
        for (const actions of flow.actions) {
          const provider = actions.action.provider;
          const endpoint = actions.action.name;
          const payload = JSON.parse(actions.payload);
          const apiUrl = this.configService.get("api_url");
          const response = await fetch(`${apiUrl}/${provider}/${endpoint}`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          });
          console.log("Response: ", response);
        }
        await this.flowService.updateFlowStatus(flow.id, Status.STANDBY);
      }
    }
  }
}
