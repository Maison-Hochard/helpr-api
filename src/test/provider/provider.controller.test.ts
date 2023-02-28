import { Test, TestingModule } from "@nestjs/testing";
import { ProviderController } from "../../provider/provider.controller";
import { ProviderService } from "../../provider/provider.service";

describe("ProviderController", () => {
  let providerController: ProviderController;
  let providerService: ProviderService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProviderController],
      providers: [ProviderService],
    }).compile();

    providerService = moduleRef.get<ProviderService>(ProviderService);
    providerController = moduleRef.get<ProviderController>(ProviderController);
  });

  describe("getProviders", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an array of providers", async () => {});
  });

  describe("getCredentials", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an array of credentials for the current user", async () => {});
  });

  describe("getAvailableActions", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an array of available actions", async () => {});
  });

  describe("getAvailableTriggers", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an array of available triggers", async () => {});
  });

  describe("getUserProviders", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should return an array of providers for the current user", async () => {});
  });

  describe("manageProvider", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should create or update a provider", async () => {});
  });

  describe("manageAction", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should create or update an action", async () => {});
  });
  describe("deconnectProvider", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it("should deconnect a provider", async () => {});
  });
});
