import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserService } from "../user/user.service";

import { Public } from "../auth/decorators/public.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("linear")
export class GithubController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post("webhook")
  async webhook(@Body() body: any) {
    console.log(body);
  }

  @Post("create-webhook")
  async createWebhook(@Body("accessToken") accessToken: string) {}
}
