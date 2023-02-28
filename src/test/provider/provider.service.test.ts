import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { ProviderService } from "../../provider/provider.service";
import { MailingService } from "../../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { UserService } from "../../user/user.service";
import { encrypt, decrypt } from "../../utils";
import {
  createActionInput,
  createProviderInput,
  createTriggerInput,
} from "../../provider/provider.type";

describe("ProviderService", () => {
  let app: INestApplication;
  let providerService: ProviderService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderService,
        MailingService,
        ConfigService,
        PrismaService,
        UserService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    providerService = moduleFixture.get<ProviderService>(ProviderService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("getProviders", () => {
    it("should return all providers", async () => {
      const providers = await providerService.getProviders();

      expect(providers.length).toBeGreaterThan(0);
    });
  });

  describe("getCredentials", () => {
    it("should throw BadRequestException when user is not found", async () => {
      await expect(providerService.getCredentials(0)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should return provider credentials for the given user", async () => {
      const userId = 1;

      const credentials = await providerService.getCredentials(userId);

      expect(credentials).toBeDefined();
    });
  });

  describe("getCredentialsByProvider", () => {
    it("should throw BadRequestException when user is not found", async () => {
      await expect(
        providerService.getCredentialsByProvider(0, "google"),
      ).rejects.toThrow(BadRequestException);
    });

    it("should return provider credentials for the given user and provider", async () => {
      const userId = 1;
      const provider = "google";

      const credentials = await providerService.getCredentialsByProvider(
        userId,
        provider,
      );

      expect(credentials).toBeDefined();
    });

    it("should return decrypted access token when decrypted parameter is true", async () => {
      const userId = 1;
      const provider = "google";
      const decrypted = true;

      const credentials = await providerService.getCredentialsByProvider(
        userId,
        provider,
        decrypted,
      );

      expect(credentials.accessToken).toBeDefined();
      expect(decrypt(credentials.accessToken)).toBeDefined();
    });
  });

  describe("getRefreshTokenByProvider", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("addCredentials", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("createOrUpdateAction", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("createOrUpdateTrigger", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("createOrUpdateProvider", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("getAvailableActions", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("getAvailableTriggers", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("getUserProviders", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });

  describe("deconnectProvider", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should throw BadRequestException when user is not found", async () => {});
  });
});
