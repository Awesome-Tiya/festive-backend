import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
    },

    collectCoverageFrom: [
        "src/**/*.(t|j)s",
        "!src/**/*.module.ts",
        "!src/**/*.dto.ts",
    ],

    coveragePathIgnorePatterns: [
        "/dist/",
    ],
};

export default config;