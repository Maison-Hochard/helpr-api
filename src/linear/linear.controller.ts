import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserService } from "../user/user.service";

import { Public } from "../auth/decorators/public.decorator";
import { LinearService } from "./linear.service";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("linear")
export class LinearController {
  constructor(private readonly linearService: LinearService) {}

  @Public()
  @Post("webhook")
  async webhook(@Body() body) {
    if (body.data && body.data.action === "create") {
      const { title, number, labels, team } = body.data;
      const prefix = (
        labels && labels[0].name ? labels[0].name : "feature"
      ).toLowerCase();
      const teamName = (team && team.name ? team.name : title).toLowerCase();
      const branchName = `${prefix}/${teamName}-${number}`;
      console.log(branchName);
    }
  }

  @Post("create-webhook")
  async createWebhook() {
    const teamId = "34b08c67-0366-4cc0-8a32-07d481c045f1";
    await this.linearService.createWebhook(
      teamId,
      "lin_api_OPD0XYHqsu9KSeRt64EAvdScbE8S7kK3UkAa2qGe",
    );
    return {
      message: "webhook_created",
    };
  }

  @Get("teams")
  async getTeams(@Body("accessToken") accessToken: string) {
    return await this.linearService.getTeams(accessToken);
  }
}
