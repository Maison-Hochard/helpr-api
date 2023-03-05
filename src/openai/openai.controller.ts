import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { OpenaiService } from "./openai.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { createCompletionInput } from "./openai.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("openai")
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post("create-completion")
  async createCompletion(
    @CurrentUser() user: JwtPayload,
    @Body() completion: createCompletionInput,
  ) {
    return await this.openaiService.createCompletion(user.id, completion);
  }

  @Post("data")
  async getData() {
    return await this.openaiService.getData();
  }
}
