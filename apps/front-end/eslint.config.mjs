import { FlatCompat } from "@eslint/eslintrc";
import eslintConfig from "eslint-config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const ignoreConfig = {
  name: "front-end:ignore",
  ignores: ["coverage/", ".next/", "next-env.d.ts"],
};

const tsConfig = {
  name: "front-end:ts",
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.mjs", "examples/*.mjs"],
      },
    },
  },
};

const nextCoreWebVitalsConfig = compat.extends("next/core-web-vitals");
const nextTypescriptConfig = compat.extends("next/typescript");

/** Remove plugins that are already defined in base config */
const removeConflictingPlugins = configs => configs.map((config) => {
  if (config.plugins) {
    delete config.plugins["import"];
    delete config.plugins["@typescript-eslint"];
  }
  return config;
});

const filteredNextCoreWebVitals = removeConflictingPlugins(nextCoreWebVitalsConfig);
const filteredNextTypescript = removeConflictingPlugins(nextTypescriptConfig);

const flatConfig = [
  ...filteredNextCoreWebVitals,
  ...filteredNextTypescript,
  ...eslintConfig,
  ignoreConfig,
  tsConfig,
];

export default flatConfig;
