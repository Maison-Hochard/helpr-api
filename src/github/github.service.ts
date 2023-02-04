import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { Octokit } from "octokit";
import { ProviderService } from "../provider/provider.service";

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async createWebhook(teamId: string, accessToken: string) {}

  async createCredentials(userId: number, accessToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
    const octokit = new Octokit({
      auth: accessToken,
    });
    const githubResponse = await octokit.request("GET /user");
    const githubUser = githubResponse.data;
    if (!githubUser) throw new BadRequestException("Invalid access token");
    return await this.providerService.addCredentials(
      user.id,
      githubUser.id.toString(),
      "github",
      accessToken,
    );
  }

  async getUser(userId: number, accessToken: string) {
    const octokit = new Octokit({
      auth: accessToken,
    });
    const githubResponse = await octokit.request("GET /user");
    const githubUser = githubResponse.data;
    if (!githubUser) throw new BadRequestException("Invalid access token");
    return githubUser;
  }

  async createBranch(
    userId: number,
    repo: string,
    branch: string,
    newBranch: string,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({
      auth: accessToken,
    });
    const user = await this.getUser(userId, accessToken);
    const getBranches = async () => {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/branches",
        {
          owner: user.login,
          repo: repo,
        },
      );
      return response.data;
    };
    const checkBranchName = (branchName, branches) => {
      return branches.find((branch) => branch.name === branchName);
    };
    const getLatestCommitOnMaster = async (branches) => {
      const branch = branches.find((branch) => branch.name === "master");
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/commits/{ref}",
        {
          owner: user.login,
          repo: repo,
          ref: branch.commit.sha,
        },
      );
      return response.data;
    };
    const branches = await getBranches();
    if (checkBranchName(newBranch, branches))
      throw new BadRequestException("Branch already exists");
    const latestCommitOnMaster = await getLatestCommitOnMaster(branches);
    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/git/refs",
      {
        owner: user.login,
        repo: repo,
        ref: `refs/heads/${newBranch}`,
        sha: latestCommitOnMaster.sha,
      },
    );
    return response.data;
  }
}
