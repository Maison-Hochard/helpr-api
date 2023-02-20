import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { ProviderCredentials } from "@prisma/client";
import { Test, TestingModule } from '@nestjs/testing';
import { LinkedinService } from './linkedin.service';
import { LinkedinController } from "./linkedin.controller";

describe('LinkedinService', () => {
    let linkedinController: LinkedinController;
    let linkedinService: LinkedinService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LinkedinController,
                LinkedinService,
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
        linkedinService = module.get<LinkedinService>(LinkedinService);
        linkedinController = module.get<LinkedinController>(LinkedinController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createWebhook', () => {
        it('should create a webhook for the specified organization', async () => {
        });
    });

    describe('handleWebhook', () => {
        it('should log the owner id and the event name', async () => {
        });
    });

    describe('createCredentials', () => {
        it('should create credentials for the specified user', async () => {
        });
    });

    describe('postOnLinkedIn', () => {
        it('should post on LinkedIn', async () => {
        });
    });
});