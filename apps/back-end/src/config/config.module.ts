import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ConfigService } from "./config.service";
import { envValidationConfig } from "./env.config";

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      ...envValidationConfig,
      isGlobal: true,
      envFilePath: process.env["ENV_FILE_PATH"] ?? ".env",
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
