import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public } from "../auth/decorators/public.decorator";
import { LinkedinService } from "./linkedin.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { createPostInput } from "./linkedin.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("linkedin")
export class LinkedinController {
  constructor(private readonly linkedinService: LinkedinService) {}
  @Post("add-credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.linkedinService.createCredentials(user.id, accessToken);
  }

  @Post("create-post")
  async createPost(
    @CurrentUser() user: JwtPayload,
    @Body("content") content: string,
  ) {
    return await this.linkedinService.postOnLinkedIn(user.id, content);
  }
}
