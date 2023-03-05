import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { DeeplService } from "./deepl.service";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { translateTextInput } from "./deepl.type";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("deepl")
export class DeeplController {
  constructor(private readonly deeplService: DeeplService) {}

  @Post("data")
  async getData() {
    return await this.deeplService.getData();
  }

  @Post("translate")
  async translateText(
    @CurrentUser() user: JwtPayload,
    @Body() text: translateTextInput,
  ) {
    return await this.deeplService.translateText(user.id, text);
  }
}
