import { BadRequestException, Body, Injectable, Post } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { Octokit } from "octokit";
import { ProviderService } from "../provider/provider.service";
import {
  createReleaseInput,
  createBranchInput,
  createPullRequestInput,
  createIssueInput,
} from "./github.type";
import { Model } from "../openai/openai.type";

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
   * Create a webhook GitHub
   * @param userId
   * @param name
   * @param where
   */
  async createWebhook(
    userId: number,
    name: string,
    where: string,
  ): Promise<any> {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const githubClient = new Octokit({
      auth: accessToken,
    });
    const user = await this.getUser(userId, accessToken);
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/github/webhook";
    const webhookDevUrl =
      "https://7aa5-78-126-205-77.eu.ngrok.io/github/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    return await githubClient.request("POST /repos/{owner}/{repo}/hooks", {
      owner: user.login,
      repo: where,
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

  async createBranch(userId: number, createBranchInput: createBranchInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({ auth: accessToken });
    const user = await this.getUser(userId, accessToken);
    const { data: latestCommit } = await octokit.rest.repos.getBranch({
      owner: user.login,
      repo: createBranchInput.github_repository,
      branch: createBranchInput.github_from_branch,
    });

    createBranchInput.github_branch_name = createBranchInput.github_branch_name
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    await octokit.rest.git.createRef({
      owner: user.login,
      repo: createBranchInput.github_repository,
      ref: `refs/heads/${createBranchInput.github_branch_name}`,
      sha: latestCommit.commit.sha,
    });

    return {
      message: "branch_created",
    };
  }

  async createRelease(userId: number, createRealeaseInput: createReleaseInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({ auth: accessToken });
    const user = await this.getUser(userId, accessToken);
    const releaseData = {
      owner: user.login,
      repo: createRealeaseInput.github_repository,
      tag_name: createRealeaseInput.github_release_tag,
      target_commitish: createRealeaseInput.github_release_target_commitish,
      name: createRealeaseInput.github_release_title,
      body: createRealeaseInput.github_release_body || "",
      draft: createRealeaseInput.github_release_draft || false,
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
    createPullRequestInput: createPullRequestInput,
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
      repo: createPullRequestInput.github_repository,
      title: createPullRequestInput.github_pull_request_title,
      body: createPullRequestInput.github_pull_request_body,
      head: createPullRequestInput.github_pull_request_head,
      base: createPullRequestInput.github_pull_request_base,
    });
    return { message: "pull_request_created", data };
  }

  async createIssue(userId: number, createIssueInput: createIssueInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({ auth: accessToken });
    const user = await this.getUser(userId, accessToken);

    const { data } = await octokit.rest.issues.create({
      owner: user.login,
      repo: createIssueInput.github_repository,
      title: createIssueInput.github_issue_title,
      body: createIssueInput.github_issue_body,
      labels: createIssueInput.github_issue_labels || [],
    });

    return {
      message: "issue_created",
      variables: {
        last_github_issue_title: createIssueInput.github_issue_title,
        last_github_issue_body: createIssueInput.github_issue_body,
        last_github_issue_labels: createIssueInput.github_issue_labels,
      },
    };
  }

  async getData(userId: number) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "github",
      true,
    );
    const octokit = new Octokit({ auth: accessToken });
    const repositories = await octokit.rest.repos.listForAuthenticatedUser();
    return {
      github_repository: repositories.data.map((repo) => {
        return {
          name: repo.name,
          value: repo.name,
        };
      }),
    };
  }
}
