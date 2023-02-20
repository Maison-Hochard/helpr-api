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

  async translateText(userId: number, translateTextInput: translateTextInput) {
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
    const response = await translator.translateText(
      translateTextInput.deepl_text,
      <SourceLanguageCode>translateTextInput.deepl_source_lang,
      <TargetLanguageCode>translateTextInput.deepl_target_lang,
    );
    return {
      message: "text_translated",
      data: response,
    };
  }
}
