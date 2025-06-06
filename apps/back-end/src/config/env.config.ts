import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

// @todo: fill this out
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EnvironmentVariables {}

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
