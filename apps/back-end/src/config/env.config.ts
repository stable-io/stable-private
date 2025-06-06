import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsPort, validateSync } from "class-validator";

export class EnvironmentVariables {
  @IsPort()
  @IsNotEmpty()
  public PORT!: number;
}

export const validate = (
  config: Record<string, string>,
): EnvironmentVariables => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};

export const envValidationConfig = {
  validationSchema: EnvironmentVariables,
  validate,
};
