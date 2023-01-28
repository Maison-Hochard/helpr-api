import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import {} from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";

@ApiTags("Stripe")
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("stripe")
export class StripeController {
  constructor(private readonly userService: UserService) {}
}
