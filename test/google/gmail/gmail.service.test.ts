import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../../src/prisma.service";
import { UserService } from "../../../src/user/user.service";
import { ProviderService } from "../../../src/provider/provider.service";
import { createDraftInput, createMailInput } from "../../../src/google/gmail/gmail.type";
import { google } from "googleapis";
import { GmailService } from "../../../src/google/gmail/gmail.service";
import { GmailController } from "../../../src/google/gmail/gmail.controller";

describe('GmailService', () => {
    let gmailController: GmailController;
    let gmailService: GmailService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GmailController,
                GmailService,
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
        gmailService = module.get<GmailService>(GmailService);
        gmailController = module.get<GmailController>(GmailController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createCredentials', () => {
        it('should create credentials for the specified user', async () => {
        });
    });

    describe('handleWeb@hook', () => {
        it('should handle a webhook', async () => {
        });
    });

    describe('createWebhook', () => {
        it('should create a webhook for the specified repository', async () => {
        });
    });

    describe('createDraft', () => {
        it('should create a draft', async () => {
        });
    });

    describe('createMail', () => {
        it('should create a mail', async () => {
        });
    });
});