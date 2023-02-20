import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { MailingService } from '../mailing/mailing.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { ProviderService } from '../provider/provider.service';
import { GithubController } from './github.controller';


describe('GithubService', () => {
    let githubController: GithubController;
    let githubService: GithubService;
    let mailingService: MailingService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [
          GithubController,
        ],
        providers: [
          GithubService,
          MailingService,
          ConfigService,
          PrismaService,
          UserService,
          ProviderService,
        ],
      }).compile();
  
      
      mailingService = module.get<MailingService>(MailingService);
      configService = module.get<ConfigService>(ConfigService);
      prismaService = module.get<PrismaService>(PrismaService);
      userService = module.get<UserService>(UserService);
      providerService = module.get<ProviderService>(ProviderService);
      githubService = module.get<GithubService>(GithubService);
      githubController = module.get<GithubController>(GithubController);
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    describe('createWebhook', () => {
        it('should create a webhook for the specified repository', async () => {
        });
    });
  
    describe('handleWebhook', () => {
        it('should log the owner id and the event name', async () => {
        });
    });
  
    describe('createCredentials', () => {
        it('should create credentials for the specified user', async () => {
        });
          
        it('should throw an error if the user is not found', async () => {
        });
    });

    describe('getUser', () => {
        it('should return the user', async () => {
        });
    });

    describe('createBranch', () => {
        it('should create a branch', async () => {
        });
    });
});
