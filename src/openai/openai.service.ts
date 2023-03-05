import { Injectable } from "@nestjs/common";
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
    const gpt_turbo_model = "gpt-3.5-turbo"; // Type 3
    const openai = new OpenAIApi(configuration);
    const model =
      createCompletionInput.openai_model === Model.DaVinci
        ? davinci_model
        : createCompletionInput.openai_model === Model.Curie
        ? curie_model
        : gpt_turbo_model;
    const max_tokens =
      typeof createCompletionInput.openai_max_tokens === "string"
        ? parseInt(createCompletionInput.openai_max_tokens)
        : createCompletionInput.openai_max_tokens;
    const response = await openai.createCompletion({
      model: davinci_model,
      prompt: createCompletionInput.openai_prompt,
      temperature: 0.9,
      max_tokens: max_tokens ?? 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return {
      variables: [
        {
          key: "openai_response",
          value: response.data.choices[0].text,
        },
      ],
    };
  }

  async getData() {
    const openai_model = [
      {
        name: "GPT Turbo",
        value: Model.GPT_TURBO,
      },
      {
        name: "Davinci",
        value: Model.DaVinci,
      },
      {
        name: "Curie",
        value: Model.Curie,
      },
    ];
    return {
      openai_model: openai_model,
    };
  }
}
