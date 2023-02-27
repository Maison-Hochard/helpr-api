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

  replaceVariables(variables: any, payload: any) {
    // The function will replace the variables in the payload
    // The payload looks like this:
    // {
    //   github_branch_name: 'feature-{last_linear_ticket_title}',
    //   github_from_branch: 'master',
    //   github_repository: 'nuxtjs-boilerplate'
    // }
    // The variables looks like this:
    // [
    //   {
    //     last_linear_ticket_title: 'ticket-test'
    //   },
    //   {
    //     last_linear_ticket_description: 'Ticket Test Description'
    //   }
    // ]
    // The function will return:
    // {
    //   github_branch_name: 'feature-ticket-test',
    //   github_from_branch: 'master',
    //   github_repository: 'nuxtjs-boilerplate'
    // }
    const payloadKeys = Object.keys(payload);
    for (const key of payloadKeys) {
      for (const variable of variables) {
        const variableKey = Object.keys(variable)[0];
        const variableValue = Object.values(variable)[0];
        payload[key] = payload[key].replace(`{${variableKey}}`, variableValue);
      }
    }
    return payload;
  }

  async runFlow(flows) {
    for (const flow of flows) {
      if (flow.status === Status.READY) {
        console.log("Running flow: ", flow.name);
        await this.flowService.updateFlowStatus(flow.id, Status.RUNNING);
        let variables = [
          {
            last_linear_ticket_title: "ticket-test",
          },
          {
            last_linear_ticket_description: "Ticket Test Description",
          },
        ];
        const accessToken = flow.accessToken;
        for (const flowActions of flow.actions) {
          console.log("Running action: ", flowActions.action.name);
          const endpoint = flowActions.action.endpoint;
          const name = flowActions.action.name;
          const payload = JSON.parse(flowActions.payload);
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
          const { data, message, statusCode } = await response.json();
          console.log(
            flowActions.action.name + " " + message + ":",
            statusCode,
          );
          if (data && data.variables) {
            variables = [...variables, data.variables];
          }
        }
        await this.flowService.updateFlowStatus(flow.id, Status.STANDBY);
      }
    }
  }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async runInstantFlow() {
    const { data: flows } = await this.flowService.getFlowsToRun(
      Trigger.INSTANT,
    );
    if (flows.length === 0) {
      console.log("No flow to run");
    }
    await this.runFlow(flows);
  }
}
