/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  verbose: true,
  silent: false,
  detectOpenHandles: false,
  collectCoverage: true,
  coverageDirectory: "./coverage",
};
