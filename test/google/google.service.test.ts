import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../src/prisma.service";
import { UserService } from "../../src/user/user.service";
import { ProviderService } from "../../src/provider/provider.service";
import { google } from "googleapis";
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleService } from "../../src/google/google.service";
import { GoogleController } from "../../src/google/google.controller";

describe('GoogleService', () => {
    let googleController: GoogleController;
    let googleService: GoogleService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleController,
                GoogleService,
                ConfigService,
                PrismaService,
                UserService,
                ProviderService,
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        prismaService = module.get<PrismaService>(PrismaService);
        userService = module.get<UserService>(UserService);
        providerService = module.get<ProviderService>(ProviderService);
        googleService = module.get<GoogleService>(GoogleService);
        googleController = module.get<GoogleController>(GoogleController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createCredentials', () => {
        it('should create credentials for the specified user', async () => {
        });
    });
});