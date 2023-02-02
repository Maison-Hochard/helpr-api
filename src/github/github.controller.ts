import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public } from "../auth/decorators/public.decorator";
import { GithubService } from "./github.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("github")
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Public()
  @Post("webhook")
  async webhook(@Body() body) {}

  @Post("create-webhook")
  async createWebhook(@Body("accessToken") accessToken: string) {
    await this.githubService.createWebhook(accessToken);
    return {
      message: "webhook_created",
    };
  }

  @Get("user")
  async getUser(@CurrentUser() user: JwtPayload) {}

  @Post("credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.githubService.createCredentials(user.id, accessToken);
  }

  @Post("branches")
  async createBranch(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
    @Body("repo") repo: string,
    @Body("branch") branch: string,
  ) {
    return await this.githubService.createBranch(
      user.id,
      accessToken,
      repo,
      branch,
    );
  }

  @Get("teams")
  async getTeams(@Body("accessToken") accessToken: string) {}
}
