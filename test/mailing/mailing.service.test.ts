import { MailerService } from "@nestjs-modules/mailer";
import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from '../../src/mailing/mailing.service';
import { JwtPayload } from '../../src/auth/auth.service';
import { User } from '@prisma/client';

describe('MailingService', () => {
    let mailingService: MailingService;
    let mailerService: MailerService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            MailingService,
            {
              provide: MailerService,
              useValue: {
                sendMail: jest.fn(),
              },
            },
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
            const user: JwtPayload = {
                username: 'testuser',
                email: 'test@example.com',
                id: 0,
                role: 0
            };
            const url = 'http://localhost:3000/verify/1234';
            const expectedSubject = 'Please confirm your email';
            const expectedTemplate = 'verif-code';
            const expectedContext = { username: user.username, verifyUrl: url };

            await mailingService.sendNewVerification(user, url);

            expect(mailerService.sendMail).toHaveBeenCalledWith({
                to: user.email,
                subject: expectedSubject,
                template: expectedTemplate,
                context: expectedContext,
                attachments: mailingService.attachments,
            });
        });
    });
    
    describe('sendNewUser', () => {
        it('should send an email to the specified user', async () => {
            const user: JwtPayload = {
                username: 'testuser', email: 'test@example.com',
                id: 0,
                role: 0
            };
            const url = 'http://localhost:3000/verify/1234';
            const expectedSubject = 'Welcome to NestJS';
            const expectedTemplate = 'new-user';
            const expectedContext = { username: user.username, verifyUrl: url };

            await mailingService.sendNewUser(user, url);

            expect(mailerService.sendMail).toHaveBeenCalledWith({
                to: user.email,
                subject: expectedSubject,
                template: expectedTemplate,
                context: expectedContext,
                attachments: mailingService.attachments,
            });
        });
    });

    describe('sendResetPassword', () => {
        it('should send an email to the specified user', async () => {
            const user: User = {
                id: 1, username: 'testuser', email: 'test@example.com',
                loginType: "",
                firstname: "",
                lastname: "",
                password: "",
                stripeCustomerId: "",
                createdAt: undefined,
                updatedAt: undefined,
                role: 0,
                isVerified: false,
                refreshToken: "",
                authToken: "",
                avatar: ""
            };
            const url = 'http://localhost:3000/reset-password/1234';
            const expectedSubject = 'Reset your password';
            const expectedTemplate = 'reset-password';
            const expectedContext = { username: user.username, resetUrl: url };

            await mailingService.sendResetPassword(user, url);

            expect(mailerService.sendMail).toHaveBeenCalledWith({
                to: user.email,
                subject: expectedSubject,
                template: expectedTemplate,
                context: expectedContext,
                attachments: mailingService.attachments,
            });
        });
    });

    describe('sendResetPasswordSuccess', () => {
        it('should send an email to the specified user', async () => {
            const user: User = {
                id: 1, username: 'testuser', email: 'test@example.com',
                loginType: "",
                firstname: "",
                lastname: "",
                password: "",
                stripeCustomerId: "",
                createdAt: undefined,
                updatedAt: undefined,
                role: 0,
                isVerified: false,
                refreshToken: "",
                authToken: "",
                avatar: ""
            };
            const url = 'http://localhost:3000/reset-password/1234';
            const expectedSubject = 'Reset your password';
            const expectedTemplate = 'reset-password';
            const expectedContext = { username: user.username, resetUrl: url };

            await mailingService.sendResetPassword(user, url);

            expect(mailerService.sendMail).toHaveBeenCalledWith({
                to: user.email,
                subject: expectedSubject,
                template: expectedTemplate,
                context: expectedContext,
                attachments: mailingService.attachments,
            });
        });
    });
});