import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtPayload } from "../auth/auth.service";
import { User } from "@prisma/client";
import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from './mailing.service';

describe('MailingService', () => {
    let mailingService: MailingService;
    let mailerService: MailerService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            MailingService,
            MailerService,
        ],
        }).compile();
    
        mailingService = module.get<MailingService>(MailingService);
        mailerService = module.get<MailerService>(MailerService);
    });
    
    afterEach(() => {
        jest.resetAllMocks();
    });
    
    describe('sendNewVerification', () => {
        it('should send an email to the specified user', async () => {
        });
    });
    
    describe('sendNewUser', () => {
        it('should send an email to the specified user', async () => {
        });
    });

    describe('sendResetPassword', () => {
        it('should send an email to the specified user', async () => {
        });
    });

    describe('sendResetPasswordSuccess', () => {
        it('should send an email to the specified user', async () => {
        });
    });
});