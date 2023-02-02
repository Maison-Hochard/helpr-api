import { BadRequestException, Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { Octokit } from "octokit";

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function

  /**
   * Create a webhook Github
   * @param accessToken
   */
  async createWebhook(accessToken: string) {
    // Create client
    const githubClient = new Octokit({
      auth: accessToken,
    });

    // Inits
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/github/webhook";
    const webhookDevUrl =
      "https://c572-78-126-205-77.eu.ngrok.io/github/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;

    // Return the response
    return await githubClient.request(
      "POST /repos/HugoRCD/nuxtjs-boilerplate/hooks",
      {
        owner: "HugoRCD",
        repo: "nuxtjs-boilerplate",
        name: "web",
        active: true,
        events: ["push", "pull_request"],
        config: {
          url: finalUrl,
          content_type: "json",
          insecure_ssl: "0",
        },
      },
    );
  }

  async createCredentials(userId: number, accessToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");
    const octokit = new Octokit({
      auth: accessToken,
    });
    const githubResponse = await octokit.request("GET /user");
    const githubUser = githubResponse.data;
    if (!githubUser) throw new BadRequestException("Invalid access token");
    await this.prisma.providerCredentials.create({
      data: {
        provider: "github",
        accessToken: accessToken,
        providerId: githubUser.id.toString(),
        userId: user.id,
      },
    });
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
    accessToken: string,
    repo: string,
    branchName: string,
  ) {
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
    if (checkBranchName(branchName, branches))
      throw new BadRequestException("Branch already exists");
    const latestCommitOnMaster = await getLatestCommitOnMaster(branches);
    const createBranch = async () => {
      const response = await octokit.request(
        "POST /repos/{owner}/{repo}/git/refs",
        {
          owner: user.login,
          repo: repo,
          ref: `refs/heads/${branchName}`,
          sha: latestCommitOnMaster.sha,
        },
      );
      return response.data;
    };
    return await createBranch();
  }
}
