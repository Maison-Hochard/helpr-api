import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../src/prisma.service";
import { createCompletionInput, Model } from "../../src/openai/openai.type";
import { Configuration, OpenAIApi } from "openai";
import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from '../../src/openai/openai.service';
import { OpenaiController } from '../../src/openai/openai.controller';

describe('OpenaiService', () => {
    let openaiController: OpenaiController;
    let openaiService: OpenaiService;
    let configService: ConfigService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OpenaiController,
                OpenaiService,
                ConfigService,
                PrismaService,
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        prismaService = module.get<PrismaService>(PrismaService);
        openaiService = module.get<OpenaiService>(OpenaiService);
        openaiController = module.get<OpenaiController>(OpenaiController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createCompletion', () => {
        it('should create a completion', async () => {
        });
    });
});