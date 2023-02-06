import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public } from "../auth/decorators/public.decorator";
import { NotionService } from "./notion.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  createDatabaseInput,
  createItemInDatabaseInput,
  createComment,
} from "./notion.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("notion")
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @Public()
  @Post("webhook")
  async webhook(@Body() body) {
    return await this.notionService.handleWebhook(body);
  }

  /*  @Post("create-webhook")
  async createWebhook(
    @CurrentUser() user: JwtPayload,
    @Body("teamId") teamId: string,
  ) {
    await this.notionService.createWebhook(user.id, teamId);
    return {
      message: "webhook_created",
    };
  }*/

  @Post("add-credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.notionService.createCredentials(user.id, accessToken);
  }

  @Post("create-item")
  async createItemInDatabase(
    @CurrentUser() user: JwtPayload,
    @Body() page: createItemInDatabaseInput,
  ) {
    return await this.notionService.createItemInDatabase(user.id, page);
  }

  @Post("create-comment")
  async createComment(
    @CurrentUser() user: JwtPayload,
    @Body() comment: createComment,
  ) {
    return await this.notionService.createComment(user.id, comment);
  }

  @Post("create-database")
  async createDatabase(
    @CurrentUser() user: JwtPayload,
    @Body() database: createDatabaseInput,
  ) {
    return await this.notionService.createDatabase(user.id, database);
  }
}
