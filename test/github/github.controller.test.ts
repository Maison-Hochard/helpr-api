import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../../src/github/github.service';
import { MailingService } from '../../src/mailing/mailing.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/prisma.service';
import { UserService } from '../../src/user/user.service';
import { ProviderService } from '../../src/provider/provider.service';
import { GithubController } from '../../src/github/github.controller';
import SpyInstance = jest.SpyInstance;

describe('GithubController', () => {
    let githubController: GithubController;
    const githubService = new GithubService(null, null, null, null, null);
    let mailingService: MailingService;
    let configService: ConfigService;
    let prismaService: PrismaService;
    let userService: UserService;
    let providerService: ProviderService;
    let createWebhookSpy: SpyInstance;
    let handleWebhookSpy: SpyInstance;
    let createCredentialsSpy: SpyInstance;
    let getUserSpy: SpyInstance;
    let createBranchSpy: SpyInstance;
  
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
      })
      .overrideProvider(GithubService)
      .useValue(githubService)
      .compile();
  
      
      mailingService = module.get<MailingService>(MailingService);
      configService = module.get<ConfigService>(ConfigService);
      prismaService = module.get<PrismaService>(PrismaService);
      userService = module.get<UserService>(UserService);
      providerService = module.get<ProviderService>(ProviderService);
      
      githubController = module.get(GithubController);

      createWebhookSpy = jest.spyOn(githubService, 'createWebhook');
      handleWebhookSpy = jest.spyOn(githubService, 'handleWebhook');
      createCredentialsSpy = jest.spyOn(githubService, 'createCredentials');
      getUserSpy = jest.spyOn(githubService, 'getUser');
      createBranchSpy = jest.spyOn(githubService, 'createBranch');
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
