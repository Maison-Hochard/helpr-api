import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import * as deepl from "deepl-node";
import { translateTextInput } from "./deepl.type";
import { SourceLanguageCode, TargetLanguageCode } from "deepl-node";
import { Model } from "../openai/openai.type";

@Injectable()
export class DeeplService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async translateText(userId: number, translateTextInput: translateTextInput) {
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
    const response = await translator.translateText(
      translateTextInput.deepl_text,
      <SourceLanguageCode>translateTextInput.deepl_source_lang,
      <TargetLanguageCode>translateTextInput.deepl_target_lang,
    );
    return {
      variables: [
        {
          key: "deepl_response",
          value: response.text,
        },
      ],
    };
  }

  async getData() {
    const deepl_source_lang = [
      {
        value: "en-US",
        name: "🇺🇸 English",
      },
      {
        value: "FR",
        name: "🇫🇷 French",
      },
      {
        value: "ES",
        name: "🇪🇸 Spanish",
      },
      {
        value: "IT",
        name: "🇮🇹 Italian",
      },
      {
        value: "DE",
        name: "🇩🇪 German",
      },
      {
        value: "NL",
        name: "🇳🇱 Dutch",
      },
      {
        value: "CH",
        name: "🇨🇭 Chinese",
      },
      {
        value: "JP",
        name: "🇯🇵 Japanese",
      },
    ];
    const deepl_target_lang = [
      {
        value: "en-US",
        name: "🇺🇸 English",
      },
      {
        value: "FR",
        name: "🇫🇷 French",
      },
      {
        value: "ES",
        name: "🇪🇸 Spanish",
      },
      {
        value: "IT",
        name: "🇮🇹 Italian",
      },
      {
        value: "DE",
        name: "🇩🇪 German",
      },
      {
        value: "NL",
        name: "🇳🇱 Dutch",
      },
      {
        value: "CH",
        name: "🇨🇭 Chinese",
      },
      {
        value: "JP",
        name: "🇯🇵 Japanese",
      },
    ];
    return {
      deepl_source_lang: deepl_source_lang,
      deepl_target_lang: deepl_target_lang,
    };
  }
}
