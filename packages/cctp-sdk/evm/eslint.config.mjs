// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import eslintConfig from "eslint-config";
import globals from "globals";

const ignoreConfig = {
  ignores: ["coverage/", "dist/"],
};

const tsConfig = {
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.mjs", "examples/*.mjs"],
      },
    },
  },
};

const examplesConfig = {
  files: ["examples/*.mjs"],
  languageOptions: {
    globals: globals.node,
  },
};

export default [...eslintConfig, ignoreConfig, tsConfig, examplesConfig];
