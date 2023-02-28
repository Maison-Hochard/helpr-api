import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { UserController } from "../../user/user.controller";
import { UserService } from "../../user/user.service";
import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { RoleGuard } from "../../auth/guards/role.guard";
import { Role } from "../../auth/decorators/role.decorator";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { UpdateUserDto } from "../../user/dto/update-user.dto";
import { formatUser } from "../../utils";
import { User } from "@prisma/client";

describe("UserController", () => {
  let app: INestApplication;
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe("getAllUsers", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an array of users", async () => {});
  });

  describe("getCurrentUser", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return a user", async () => {});
  });

  describe("getUserById", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return a user", async () => {});
  });

  describe("createUser", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should create a user", async () => {});
  });

  describe("sendNewToken", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return a message", async () => {});
  });

  describe("verifyUser", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return a verified email", async () => {});
  });

  describe("updateUser", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an updated user", async () => {});
  });

  describe("deleteUser", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an deleted user", async () => {});
  });
});
