import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../../src/prisma.service";
import { UserService } from "../../../src/user/user.service";
import { ProviderService } from "../../../src/provider/provider.service";
import { createSheetInput, updateSheetTitleInput } from "../../../src/google/sheet/sheet.type";
import { google } from "googleapis";
import { SheetService } from "../../../src/google/sheet/sheet.service";
import { SheetController } from "../../../src/google/sheet/sheet.controller";

describe('SheetService', () => {
    let sheetController: SheetController;
    let sheetService: SheetService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SheetController,
                SheetService,
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
        sheetService = module.get<SheetService>(SheetService);
        sheetController = module.get<SheetController>(SheetController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createCredentials', () => {
        it('should create credentials for the specified user', async () => {
        });
    });

    describe('handleWebhook', () => {
        it('should handle a webhook', async () => {
        });
    });

    describe('createWebhook', () => {
        it('should create a webhook for the specified repository', async () => {
        });
    });

    describe('createSheet', () => {
        it('should create a sheet', async () => {
        });
    });

    describe('updateSheetTitle', () => {
        it('should update the title of a sheet', async () => {
        });
    });
});