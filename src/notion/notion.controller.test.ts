import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { Client } from "@notionhq/client";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { ProviderCredentials } from "@prisma/client";
import {
  createItemInDatabaseInput,
  createDatabaseInput,
  createComment,
} from "./notion.type";
import { NotionService } from "./notion.service";
import { NotionController } from "./notion.controller";
import { Test, TestingModule } from '@nestjs/testing';

describe('NotionService', () => {
    let notionController: NotionController;
    let notionService: NotionService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotionController,
                NotionService,
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
        notionService = module.get<NotionService>(NotionService);
        notionController = module.get<NotionController>(NotionController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createCredentials', () => {
        it('should create credentials for the specified user', async () => {
        });
    });

    describe('createComment', () => {
        it('should create a comment on a page', async () => {
        });
    });

    describe('createDatabase', () => {
        it('should create a database', async () => {
        });
    });

    describe('createItemInDatabase', () => {
        it('should create an item in a database', async () => {
        });
    });
});