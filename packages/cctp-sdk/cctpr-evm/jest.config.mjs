// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  coverageReporters: ["lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,js}",
    "!<rootDir>/src/**/index.{ts,js}",
  ],
  //TODO implement remaining tests and set coverage back to 100
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  verbose: false,
  clearMocks: true,
  moduleNameMapper: {
    "^((?:\\.?\\./)+.*)\\.js$": "$1",
    "^@stable-io/cctp-sdk-(.*)$": "<rootDir>/../$1/src",
    "^@stable-io/(amount|map-utils|utils)$": "<rootDir>/../../common/$1/src",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { isolatedModules: true }],
  },
};
