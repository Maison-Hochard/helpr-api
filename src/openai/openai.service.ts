import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { createCompletionInput, Model } from "./openai.type";
import { Configuration, OpenAIApi } from "openai";

@Injectable()
export class OpenaiService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createCompletion(
    userId: number,
    createCompletionInput: createCompletionInput,
  ) {
    const configuration = new Configuration({
      apiKey: this.configService.get("openai.api_key"),
    });
    const davinci_model = "text-davinci-003"; // Type 1
    const curie_model = "text-curie-001"; // Type 2
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model:
        createCompletionInput.openai_completion_model === Model.Davinci
          ? davinci_model
          : createCompletionInput.openai_completion_model === Model.Curie
          ? curie_model
          : davinci_model,
      prompt: createCompletionInput.openai_completion_prompt,
      temperature: 0.9,
      max_tokens: createCompletionInput.openai_completion_size ?? 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return {
      message: "completion_created",
      variables: {
        openai_response: response.data.choices[0].text,
      },
    };
  }
}
