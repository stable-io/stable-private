import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggingMiddleware } from "./common/middleware/logging.middleware";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [
    NestConfigModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
