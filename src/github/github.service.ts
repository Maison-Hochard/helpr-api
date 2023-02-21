import { BadRequestException, Body, Injectable, Post } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { Octokit } from "octokit";
import { ProviderService } from "../provider/provider.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  /**
   * Create a webhook Github
   * @param accessToken
   */
  async createWebhook(userId: number): Promise<any> {
    // Get credentials
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    // Create client
    const githubClient = new Octokit({
      auth: accessToken,
    });

    // Inits
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/github/webhook";
    const webhookDevUrl =
      "https://7aa5-78-126-205-77.eu.ngrok.io/github/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;

    // Return the response
    return await githubClient.request("POST /repos/{owner}/{repo}/hooks", {
      owner: "cavalluccijohann",
      repo: "IMC-Calculator",
      name: "web",
      active: true,
      events: ["push", "pull_request"],
      config: {
        url: finalUrl,
        content_type: "json",
        insecure_ssl: "0",
      },
    });
  }

  async handleWebhook(body: any) {
    const { repository } = body;
    const { owner } = repository;
    const { id } = owner;
    const eventName = body.event_name;

    console.log(`The repository owner's id is: ${id}`);
    console.log(`EventName: ${eventName}`);
  }

  // provider id, status : push - pull - issue,
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
    newBranch: string,
    fromBranch: string,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({ auth: accessToken });
    const user = await this.getUser(userId, accessToken);
    const { data: latestCommit } = await octokit.rest.repos.getBranch({
      owner: user.login,
      repo: repo,
      branch: fromBranch,
    });

    newBranch = newBranch.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();

    const { data } = await octokit.rest.git.createRef({
      owner: user.login,
      repo: repo,
      ref: `refs/heads/${newBranch}`,
      sha: latestCommit.commit.sha,
    });

    return {
      message: "branch_created",
    };
  }

  async createRelease(
    userId: number,
    repo: string,
    tagName: string,
    targetCommitish: string,
    name: string,
    body: string,
    draft: boolean,
    prerelease: boolean,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );

    const octokit = new Octokit({ auth: accessToken });
    const user = await this.getUser(userId, accessToken);

    const releaseData = {
      owner: user.login,
      repo,
      tag_name: tagName,
      target_commitish: targetCommitish,
      name: name,
      body: body,
      draft: draft,
      prerelease: prerelease,
    };

    try {
      const response = await octokit.rest.repos.createRelease(releaseData);
      return {
        message: "release_created",
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating release:", error);
      throw new BadRequestException("Error creating release");
    }
  }

  async createPullRequest(
    userId: number,
    repo: string,
    title: string,
    description: string,
    base: string,
    head: string,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({ auth: accessToken });
    const user = await this.getUser(userId, accessToken);

    const { data } = await octokit.rest.pulls.create({
      owner: user.login,
      repo,
      title,
      body: description,
      head,
      base,
    });
    return { message: "pull_request_created", data };
  }

  async createIssue(
    userId: number,
    repo: string,
    title: string,
    description: string,
    label: string[],
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({ auth: accessToken });
    const user = await this.getUser(userId, accessToken);

    const { data } = await octokit.rest.issues.create({
      owner: user.login,
      repo,
      title,
      body: description,
      labels: label,
    });

    return { message: "issue_created", data };
  }
}
