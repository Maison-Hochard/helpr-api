import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { Role, Roles } from "../auth/decorators/role.decorator";
import { ApiTags } from "@nestjs/swagger";
import { JwtPayload } from "../auth/auth.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("User")
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: JwtPayload) {
    return this.userService.getUserById(user.id);
  }

  @Roles(Role.ADMIN)
  @Get("/all")
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get(":id")
  async getUserById(@Param("id") id: number) {
    return this.userService.getUserById(id);
  }

  /*@Post("verify")
  async sendNewToken(@CurrentUser() user: JwtPayload) {
    await this.userService.createVerificationUrl(user.id, true);
    return {
      message: "new_token_sent",
    };
  }

  @Post("/verify/:token")
  async verifyUser(
    @CurrentUser() user: JwtPayload,
    @Param("token") token: string,
  ) {
    return this.userService.verifyEmail(user.id, token);
  }

  @Patch(":id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    return this.userService.deleteUser(id);
  }*/
}
