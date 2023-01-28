import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { LocalGuard } from "./guards/local-auth.guard";
import { Session } from "@prisma/client";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post("login")
  async login(
    @Body("login") login: string,
    @Body("password") password: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Session> {
    const user = await this.authService.validateUser(login, password);
    const authToken = await this.authService.createAccessToken(user);
    const resetToken = await this.authService.createRefreshToken(user);
    return await this.userService.createSession(
      user,
      authToken,
      resetToken,
      response,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(
    @Body("sessionId") sessionId: string,
    @Body("userId") userId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    return this.userService.deleteSession(response, sessionId, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(@Req() request: Request): Promise<{ authToken: string }> {
    return this.authService.refreshToken(request);
  }

  /*@Post("google")
  async googleAuth(
    @Body("token") token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.googleAuth(token, response);
  }*/
}
