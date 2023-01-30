import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserService } from "../user/user.service";

import { LinearClient, LinearFetch, User } from "@linear/sdk";
import { Public } from "../auth/decorators/public.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("linear")
export class LinearController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post("webhook")
  async webhook(@Body() body: any) {
    console.log(body);
  }

  @Post("create-webhook")
  async createWebhook(@Body("accessToken") accessToken: string) {
    const linearClient = new LinearClient({
      accessToken: accessToken,
    });
    const viewer = await linearClient.viewer;
    console.log(viewer);
    const webhook = await linearClient.createWebhook({
      url: "https://api.localhost:3000/linear/webhook",
      resourceTypes: ["ISSUE"],
    });
    console.log(webhook);
    return linearClient.viewer;
    /*const teamId = "34b08c67-0366-4cc0-8a32-07d481c045f1";
    const appUrl = "https://api.localhost:3000";
    const webhookUrl = `${appUrl}/linear/webhook`;*/
  }
}
