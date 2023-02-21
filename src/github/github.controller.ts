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
  @Post("create-issue")
  async createIssue(
    @CurrentUser() user: JwtPayload,
    @Body("repo") repo: string,
    @Body("title") title: string,
    @Body("body") body: string,
    @Body("labels") labels: string[],
  ) {
    return await this.githubService.createIssue(
      user.id,
      repo,
      title,
      body,
      labels,
    );
  }

  @Post("create-release")
  async createRelease(
    @CurrentUser() user: JwtPayload,
    @Body("repo") repo: string,
    @Body("tagName") tagName: string,
    @Body("targetCommitish") targetCommitish: string,
    @Body("name") name: string,
    @Body("body") body: string,
    @Body("draft") draft: boolean,
    @Body("prerelease") prerelease: boolean,
  ) {
    return await this.githubService.createRelease(
      user.id,
      repo,
      tagName,
      targetCommitish,
      name,
      body,
      draft,
      prerelease,
    );
  }
  @Post("create-branch")
  async createBranch(
    @CurrentUser() user: JwtPayload,
    @Body("repo") repo: string,
    @Body("newBranch") newBranch: string,
    @Body("fromBranch") fromBranch: string,
  ) {
    return await this.githubService.createBranch(
      user.id,
      repo,
      newBranch,
      fromBranch,
    );
  }

  @Post("create-pull-request")
  async createPullRequest(
    @CurrentUser() user: JwtPayload,
    @Body("repo") repo: string,
    @Body("title") title: string,
    @Body("body") body: string,
    @Body("head") head: string,
    @Body("base") base: string,
  ) {
    return await this.githubService.createPullRequest(
      user.id,
      repo,
      title,
      body,
      head,
      base,
    );
  }
}
