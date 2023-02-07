import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { OpenaiService } from "./openai.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { createCompletionInput } from "./openai.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("openai")
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post("add-credentials")
  async createCredential(
    @CurrentUser() user: JwtPayload,
    @Body("accessToken") accessToken: string,
  ) {
    return await this.openaiService.createCredentials(user.id, accessToken);
  }

  @Post("create-completion")
  async createCompletion(
    @CurrentUser() user: JwtPayload,
    @Body() completion: createCompletionInput,
  ) {
    return await this.openaiService.createCompletion(user.id, completion);
  }
}
