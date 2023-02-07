import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import { createCompletionInput, Model } from "./openai.type";
import { Configuration, OpenAIApi } from "openai";

@Injectable()
export class OpenaiService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async createCredentials(userId: number, accessToken: string) {
    const configuration = new Configuration({
      apiKey: accessToken,
    });
    const openai = new OpenAIApi(configuration);
    const testing_request = await openai.listModels();
    if (!testing_request) throw new BadRequestException("Invalid access token");
    const response = await this.providerService.addCredentials(
      userId,
      "no_provider_id",
      "openai",
      accessToken,
    );
    return {
      message: "credentials_created",
      data: response,
    };
  }

  async createCompletion(
    userId: number,
    createCompletionInput: createCompletionInput,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "openai",
      true,
    );
    const configuration = new Configuration({
      apiKey: accessToken,
    });
    const davinci_model = "text-davinci-003"; // Type 1
    const curie_model = "text-curie-001"; // Type 2
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model:
        createCompletionInput.model === Model.Davinci
          ? davinci_model
          : createCompletionInput.model === Model.Curie
          ? curie_model
          : davinci_model,
      prompt: createCompletionInput.prompt,
      temperature: 0.9,
      max_tokens: createCompletionInput.size ?? 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return {
      message: "completion_created",
      data: response.data.choices[0].text,
    };
  }
}
