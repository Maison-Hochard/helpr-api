import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { MailingModule } from "./mailing/mailing.module";
import { CronModule } from "./cron/cron.module";
import { AuthModule } from "./auth/auth.module";
import { ResetPasswordModule } from "./reset-password/reset-password.module";
import { config } from "../config";
import { StripeModule } from "./stripe/stripe.module";
import { LinearModule } from "./linear/linear.module";
import { GithubModule } from "./github/github.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    LinearModule,
    UserModule,
    MailingModule,
    CronModule,
    AuthModule,
    ResetPasswordModule,
    StripeModule,
    GithubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
