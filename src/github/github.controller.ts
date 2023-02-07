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
  async webhook(@Body() body) {
    console.log("webhook", body);
    return await this.githubService.handleWebhook(body);
  }

  @Post("create-webhook")
  async createWebhook(@CurrentUser() user: JwtPayload) {
    return await this.githubService.createWebhook(user.id);
  }

  @Get("user")
  async getUser(@CurrentUser() user: JwtPayload) {}

  @Post("add-credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.githubService.createCredentials(user.id, accessToken);
  }

  @Post("create-branch")
  async createBranch(
    @CurrentUser() user: JwtPayload,
    @Body("repo") repo: string,
    @Body("branch") branch: string,
    @Body("name") name: string,
  ) {
    return await this.githubService.createBranch(user.id, repo, branch, name);
  }

  @Get("teams")
  async getTeams(@Body("accessToken") accessToken: string) {}
}
