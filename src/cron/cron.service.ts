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

  async replaceVariables(variables: any, payload: any): Promise<any> {
    for (const key of Object.keys(payload)) {
      const value = payload[key];
      if (typeof value === "object" && value !== null) {
        payload[key] = await this.replaceVariables(variables, value);
      } else if (
        typeof value === "string" &&
        value.startsWith("{") &&
        value.endsWith("}")
      ) {
        const variableName = value.substring(1, value.length - 1);
        const variable = variables.find((v) => v.hasOwnProperty(variableName));
        if (variable) {
          payload[key] = variable[variableName];
        } else {
          console.warn(`Variable ${variableName} not found`);
        }
      }
    }
    return payload;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async runInstantFlow() {
    const { data: flows } = await this.flowService.getFlowToRun(
      Trigger.INSTANT,
    );
    if (flows.length === 0) {
      console.log("No flow to run");
    }
    for (const flow of flows) {
      if (flow.status === Status.READY) {
        console.log("Running flow: ", flow.name);
        await this.flowService.updateFlowStatus(flow.id, Status.RUNNING);
        const accessToken = flow.accessToken;
        const { data: webhookData } = await this.flowService.getWebhookData(
          flow.userId,
          flow.trigger.value,
        );
        const variables = [];
        if (webhookData) {
          variables.push(JSON.parse(webhookData.data));
        }
        for (const actions of flow.actions) {
          const endpoint = actions.action.endpoint;
          const name = actions.action.name;
          const payload = JSON.parse(actions.payload);
          const payloadWithVariables = await this.replaceVariables(
            variables,
            payload,
          );
          const apiUrl = this.configService.get("api_url");
          const response = await fetch(`${apiUrl}/${endpoint}/${name}`, {
            method: "POST",
            body: JSON.stringify(payloadWithVariables),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          });
          const data = await response.json();
          console.log(data.message);
        }
        await this.flowService.updateFlowStatus(flow.id, Status.STANDBY);
      }
    }
  }
}
