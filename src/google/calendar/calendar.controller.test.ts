import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma.service";
import { UserService } from "../../user/user.service";
import { ProviderService } from "../../provider/provider.service";
import { createCalendarInput, createEventInput } from "./calendar.type";
import { google } from "googleapis";
import { CalendarService } from "./calendar.service";
import { CalendarController } from "./calendar.controller";

describe('CalendarService', () => {
    let calendarController: CalendarController;
    let calendarService: CalendarService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CalendarController,
                CalendarService,
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
        calendarService = module.get<CalendarService>(CalendarService);
        calendarController = module.get<CalendarController>(CalendarController);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createCredentials', () => {
        it('should create credentials for the specified user', async () => {
        });
    });

    describe('createEvent', () => {
        it('should create an event', async () => {
        });
    });

    describe('createCalendar', () => {
        it('should create a calendar', async () => {
        });
    });
});