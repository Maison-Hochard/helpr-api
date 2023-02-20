import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import * as deepl from "deepl-node";
import { translateTextInput } from "./deepl.type";
import { SourceLanguageCode, TargetLanguageCode } from "deepl-node";

@Injectable()
export class DeeplService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async createCredentials(userId: number) {
    const deeplUser = new deepl.Translator(process.env.DEEPL_API_KEY);
    const request = await deeplUser.getUsage();
    if (!request) throw new BadRequestException("Invalid access token");
    return await this.providerService.addCredentials(
      userId,
      "DEEPL_PROVIDER_ID",
      "deepl",
      this.configService.get("deepl.api_key"),
    );
  }

  async translateText(userId: number, translateTextInput: translateTextInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "deepl",
      true,
    );
    const translator = new deepl.Translator(accessToken);
    const response = await translator.translateText(
      translateTextInput.text,
      <SourceLanguageCode>translateTextInput.source_lang,
      <TargetLanguageCode>translateTextInput.target_lang,
    );
    return {
      message: "text_translated",
      data: response,
    };
  }
}
