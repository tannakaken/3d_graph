/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  // 以下を参考にした。
  // https://ginpen.com/2023/03/16/jest-jsdom-config/
  testEnvironment: "jsdom",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{
      // 以下を参考にした。
      // https://motomichi-works.hatenablog.com/entry/2024/09/09/115143
      tsconfig: './tsconfig.app.json',
    }],
  },
  // 以下を参考にした。
  // https://stackoverflow.com/questions/65106848/jest-configuration-setupfilesafterenv-option-was-not-found
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};