import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { LoggingMiddleware } from "./common/middleware/logging.middleware";
import { ConfigModule } from "./config/config.module";
import { MetricsModule } from "./metrics/metrics.module";

@Module({
  imports: [
    NestConfigModule,
    ConfigModule,
    MetricsModule,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
