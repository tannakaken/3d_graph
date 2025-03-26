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
  // 以下を参考にした。
  // https://qiita.com/Amsel/items/8a4859d06a8de551abf8
  "moduleNameMapper": {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
};