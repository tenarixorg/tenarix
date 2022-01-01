/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./test",
  verbose: true,
  silent: true,
  detectOpenHandles: false,
  collectCoverage: true,
  coverageDirectory: "../coverage",
};
