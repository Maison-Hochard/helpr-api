import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../src/prisma.service";
import { LinearClient } from "@linear/sdk";
import { UserService } from "../../src/user/user.service";
import { ProviderService } from "../../src/provider/provider.service";
import { ProviderCredentials } from "@prisma/client";
import { createIssueInput } from "../../src/linear/linear.type";
import { FlowService } from "../../src/flow/flow.service";
import { LinearService } from '../../src/linear/linear.service';
import { LinearController } from '../../src/linear/linear.controller';

describe('LinearService', () => {
    let linearController: LinearController;
    let linearService: LinearService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;
    let flowService: FlowService;
    let linearClient: LinearClient;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                LinearController,
            ],
            providers: [
                LinearService,
                ConfigService,
                PrismaService,
                UserService,
                ProviderService,
                FlowService,
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        prismaService = module.get<PrismaService>(PrismaService);
        userService = module.get<UserService>(UserService);
        providerService = module.get<ProviderService>(ProviderService);
        flowService = module.get<FlowService>(FlowService);
        linearService = module.get<LinearService>(LinearService);
        linearController = module.get<LinearController>(LinearController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createWebhook', () => {
        it('should create a webhook for the specified team', async () => {
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

    describe('createIssue', () => {
        it('should create an issue in the specified team', async () => {
        });
    });
});