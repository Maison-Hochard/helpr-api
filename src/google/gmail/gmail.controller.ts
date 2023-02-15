import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { RoleGuard } from "../../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Public } from "../../auth/decorators/public.decorator";
import { GmailService } from "./gmail.service";
import { JwtPayload } from "../../auth/auth.service";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { createDraftInput, createMailInput } from "./gmail.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("gmail")
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Public()
  @Post("webhook")
  async webhook() {
    return await this.gmailService.handleWebhook();
  }

  @Post("create-webhook")
  async createWebhook(@CurrentUser() user: JwtPayload) {
    return await this.gmailService.createWebhook(user.id);
  }

  @Post("create-draft")
  async createDrafts(
    @CurrentUser() user: JwtPayload,
    @Body() draft: createDraftInput,
  ) {
    return await this.gmailService.createDrafts(user.id, draft);
  }

  @Post("send-mail")
  async sendMail(
    @CurrentUser() user: JwtPayload,
    @Body() mail: createMailInput,
  ) {
    return await this.gmailService.sendMail(user.id, mail);
  }
}
